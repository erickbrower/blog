When it comes to automating development environments, [Vagrant](http://www.vagrantup.com) is king, but until pretty recently it didn't have a [Docker](http://docker.io) provider or provisioner. I've got plenty of love for Vagrant, but in the last couple of years I've been using Docker along with excellent tools like [fig](http://orchardup.github.io/fig/) to manage my development environments -- cutting Vagrant out of the process completely. 

Now that Vagrant has a Docker provider, however, it's worth taking another look. It can handle tasks like creating a host VM for running the Docker server in Mac OS X, or defining the same environment using another provider like Virtualbox. So here's one approach for managing your Docker development environment with Vagrant. 

### The Plan

I've got a Node.js app that depends on Redis and PostgreSQL. We'll need three containers -- one to run the app, and one for each of those services. Some goals for this setup are:

* We need to **share the source code directory with the app container**, because we  don't want to have to rebuild the container image every time we change the code.
* We need to **link the Redis and PostgreSQL containers to the app container**, and [Docker accomplishes that with ENV vars](http://docs.docker.com/userguide/dockerlinks/). So we'll need to update the app's config 
files to check for these new vars.
* The app relies on some other ENV vars to do its thing, like `HIPCHAT_API_KEY` for Hipchat notifications, so we'll need **a secure, convenient way to include configuration values**.
* We need solid **replacements for our dev workflow tasks** like viewing logs, or running grunt (or rake, make, or even SQL) commands. 
* And of course we need to **expose the port for the app's web server** so we can connect to it from our browser in OS X. 

### The Files

```
- /bin
  - *www
- /config
  - /db
    - index.js
    - conf.js
    - Dockerfile
    - setup.sh
- /lib
- /models
- /node_modules
- /public
- /routes
- /test
- /views
- app.js
- Dockerfile
- Gruntfile
- package.json
- Vagrantfile
- VagrantHost

```


### The Vagrantfile
```
VAGRANTFILE_API_VERSION ||= '2'

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.provider :docker do |d|
    d.vagrant_vagrantfile = './VagrantHost'
  end

  config.vm.define :redis do |container|
    container.vm.provider :docker do |d|
      d.name = 'redis'
      d.image = 'erickbrower/redis:v2.8'
      d.remains_running = true
      d.expose = [6379]
    end
  end

  config.vm.define :db do |db|
    db.vm.provider :docker do |d|
      d.name = 'db'
      d.image = 'erickbrower/postgresql:v9.1'
      d.remains_running = true
      d.expose = [5432]
    end
  end

  config.vm.define :app do |app|
    app.vm.provider :docker do |d|
      d.build_dir = '.'
      d.ports = %w{8080:8080}
      d.link 'redis:redis'
      d.link 'db:db'
      d.volumes = %w{/vagrant:/opt/app}
      d.env = {
        HIPCHAT_API_KEY: ENV['HIPCHAT_API_KEY']
      }
    end
  end
end
```

### The App Container

Ignore the `d.vagrant_vagrantfile = ./VagrantHost` line for just a moment. For now check out each of the `config.vm.define` blocks. Vagrant gives us some familiar config values for Docker containers like `expose`, `ports`, `cmd`, and `env`. The [full list is here in the docs](http://docs.vagrantup.com/v2/docker/configuration.html). I'm assuming you're familiar enough with Docker that I don't need to go into details about what these all mean, so I'll point out the interesting part, the app definition: 

```
  config.vm.define :app do |app|
    app.vm.provider :docker do |d|
      d.build_dir = '.'
      d.ports = %w{8080:8080}
      d.link 'redis:redis'
      d.link 'db:db'
      d.volumes = %w{/vagrant:/opt/app}
      d.env = {
        HIPCHAT_API_KEY: ENV['HIPCHAT_API_KEY']
      }
    end
  end
```

And its `Dockerfile`

```
FROM erickbrower/nodejs

RUN apt-get update -qq
RUN apt-get install -y postgresql-client

RUN mkdir /opt/app
WORKDIR /opt/app

RUN npm install -g grunt-cli

ADD . /opt/app
RUN npm install

EXPOSE 8080
```
So the image is built from the Dockerfile, then a container is created and run with links, port, and environment variables. `d.volumes = ['/vagrant:/opt/app']` is important -- that's what will share our source code directory from the host VM into the container. But we still need to share that same directory from Mac OS X to the host VM in order for the container to have access to it. So it's time to create a host VM with `vagrant_vagrantfile`.

### The Host VM

If Mac OS X supported Docker natively, things would be so much easier. Alas, such is not the case, and we'll need a host VM. Vagrant's docs say that if it detects that a host VM is necessary, it will create a boot2docker VM by default. But we're entirely too hip for that -- we're going to use [CoreOS](https://coreos.com/). You'll notice that I specify an alternative Vagrantfile in a top-level config:

```
  config.vm.provider 'docker' do |d|
    d.vagrant_vagrantfile = './VagrantHost'
  end
```

This tells Vagrant to use a Vagrantfile named VagrantHost in the same directory to build the host VM. My VagrantHost is basically a slimmed-down version of the [Vagrantfile provided by the CoreOS devs](https://github.com/coreos/coreos-vagrant/) themselves. Here's what it looks like:

```
VAGRANTFILE_API_VERSION ||= '2'

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = 'coreos-beta'
  config.vm.box_version = '>= 308.0.1'
  config.vm.box_url = 'http://beta.release.core-os.net/amd64-usr/current/coreos_production_vagrant.json'
  config.vm.synced_folder '.', '/vagrant', nfs: true, mount_options: ['nolock,vers=3,udp'], type: :nfs
  config.vm.network 'private_network', ip: '10.1.2.3'
  config.vm.network 'forwarded_port', guest: 8080, host: 8080

  config.vm.provider :virtualbox do |v|
    v.check_guest_additions = false
    v.functional_vboxsf = false
    v.gui = false
    v.memory = ENV['APP_VB_MEMORY'] || 1024
    v.cpus = ENV['APP_VB_CPUS'] || 2
  end

  if Vagrant.has_plugin?('vagrant-vbguest')
    config.vbguest.auto_update = false
  end
end
```

One of the great things about using Vagrant is its DSL -- the configuration is pretty much self-explanatory. We're using NFS synced folders for great speed, forwarding ports from the guest VM to the host, and overriding memory and cpu settings with ENV for convenience. 

### Development Workflow

#### First Time Setup

1. `vagrant up --provider=docker --no-parallel` - Automatically creates the CoreOS host VM, builds all of the containers and runs them. `--no-parallel` is necessary because Vagrant will check for a host VM for the first container and create one if it's missing. Which is great, except when there are five parallel first-time runs, then Vagrant creates five different host VMs and gets terribly confused trying to link them. 

2. `vagrant docker-run app -- grunt db:setup` - Custom grunt command for my app that creates the DB schema and seeds it. You'll probably want to run something similar here for your app.

3. `vagrant reload app` - Will restart the app container if your app needs it after the DB migration step. I'm using `nodemon` so the node server process is automatically restarted, no `reload` necessary. 

#### Common Tasks
The source code directory is automatically synced with the app Docker 
container, so any changes are reflected immediately without rebuilding. 

I Need to...           | So with Vagrant I ...
------------           | ---------------------
Run a grunt task       | `vagrant docker-run app -- grunt my:task:here`
View/follow logs       | `vagrant docker-logs [app,db,redis] -f`
Install an npm package | `vagrant docker-run app -- npm install thing --save`
Get a REPL             | `vagrant docker-run app -t -- node`
Get a shell            | `vagrant docker-run app -t -- /bin/bash`
Restart everything     | `vagrant global-status`, find the ID for the Host VM in the list, `vagrant reload <the_id>`, then `vagrant up --provider=docker --no-parallel`

I've noticed that I need to "restart everything" when I come back after closing my laptop, or when it sleeps. It will give errors about a stale NFS file handle at `/vagrant` in the host VM. I'd love to fully understand what's happening there, but it makes sense to have to restart in that case, and to me it's not a big deal. 

Next on my list is configuring remote debugging for node or ruby projects, so developers can use their favorite step debugger. 
