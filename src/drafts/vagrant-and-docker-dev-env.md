When it comes to automating development environments, [Vagrant](http://www.vagrantup.com) is king, but until pretty recently it didn't have a [Docker](http://docker.io) provider or provisioner. Vagrant is certainly what I learned and used first, but in the last couple of years I've been using Docker along with excellent tools like fig to manage my development environments -- cutting Vagrant out of the process completely. 

Here's the thing though: that approach is great for Docker fanboys like me, but for other developers (or even UI/UX designers, mobile developers) who may not be so ops-minded, fully understanding and using Docker can be a little overwhelming. Fig does a great job of abstracting Docker's crazy long commands into neat little `fig` commands, but Vagrant can go the extra mile and handle tasks like creating a host VM for running the Docker server in Mac OS X, or defining the same environment using another provider like Virtualbox. Plus there's the added flexibility of defining your configuration with a ruby script. So here's one approach for managing your Docker development environment with Vagrant. 

### Plan of Attack

I've got a Node.js app that depends on Redis and PostgreSQL. So that's three containers -- one to run the app, and one for each of those services. Let's think this through:

* We need to **share the source code directory with the app container**, because we  don't want to have to rebuild the container image every time we change the code.
* We need to **link the Redis and PostgreSQL containers to the app container**, and Docker accomplishes that with ENV vars. So we'll need to update the app's config 
files to check for these new vars.
* The app relies on some other ENV vars to do its thing, like HIPCHAT_API_KEY for Hipchat notifications, so we'll need **a secure, convenient way to include configuration values**.
* We need solid **replacements for our dev workflow tasks** like viewing logs, or running grunt (or rake, make, or even SQL) commands. 
* And of course we need to **expose the port for the app's web server** so we can connect to it from our browser in OS X. 


### The Vagrantfile

```
cd ~/Workbench/my_project
vim Vagrantfile
```

```
VAGRANTFILE_API_VERSION ||= '2'

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.provider 'docker' do |d|
    d.vagrant_vagrantfile = './VagrantHost'
  end

  config.vm.define 'redis' do |container|
    container.vm.provider 'docker' do |d|
      d.name = 'redis'
      d.image = 'erickbrower/redis:v2.8'
      d.remains_running = true
      d.expose = [6379]
    end
  end

  config.vm.define 'db' do |db|
    db.vm.provider 'docker' do |d|
      d.name = 'db'
      d.build_dir = './config/db'
      d.remains_running = true
      d.expose = [5432]
    end
  end

  config.vm.define 'app' do |app|
    app.vm.provider 'docker' do |d|
      d.build_dir = '.'
      d.ports = ['8080:8080']
      d.link 'redis:redis'
      d.link 'db:db'
      d.volumes = ['/vagrant:/opt/app']
      d.env = {
        HIPCHAT_API_KEY: ENV['HIPCHAT_API_KEY']
      }
    end
  end
end
```
### The App Container
Ignore the `d.vagrant_vagranfile = ./VagrantHost` line for now, I'll get to that. For now check out each of the `config.vm.define` blocks. Vagrant gives us some familiar config values like `expose`, `ports`, `cmd`, and `env`. The [full list is here in the docs](http://docs.vagrantup.com/v2/docker/configuration.html). I'm assuming you're familiar enough with Docker that I don't need to go into details about what these all mean, so I'll point out the interesting part, the app definition: 

```
  config.vm.define 'app' do |app|
    app.vm.provider 'docker' do |d|
      d.build_dir = '.'
      d.ports = ['8080:8080']
      d.link 'redis:redis'
      d.link 'db:db'
      d.volumes = ['/vagrant:/opt/app']
      d.env = {
        HIPCHAT_API_KEY: ENV['HIPCHAT_API_KEY']
      }
    end
  end
```

Here's where we link it to the containers we defined above it, and pass through any environment variables the app needs. `d.volumes = ['/vagrant:/opt/app']` is important -- that's what will share our source code directory from the host VM into the container. But we still need to share that same directory from Mac OS X to the host VM in order for the container to have access to it. So it's time to create a host VM with `vagrant_vagrantfile`.

### The Host VM

If Mac OS X supported Docker natively, things would be so much easier. Alas, such is not the case, and we'll need a host VM. Vagrant's docs say that if it detects that a host VM is necessary, it will create a boot2docker VM by default. But we're entirely too hip for that -- we're going to use CoreOS. You'll 
notice that I specify an alternative in a top-level config:

```
  config.vm.provider 'docker' do |d|
    d.vagrant_vagrantfile = './VagrantHost'
  end
```

This tells Vagrant to use a Vagrantfile named VagrantHost in the same directory to build the host VM. It's basically my slimmed-down version of the coreos-vagrant Vagrantfile provided by the CoreOS devs themselves. Here's what it looks like:

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

### First Time Setup


### Development Workflow