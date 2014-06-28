# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION ||= '2'

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.provider :docker do |d|
    d.vagrant_vagrantfile = 'VagrantHost'
  end

  config.vm.define :app do |app|
    app.vm.provider :docker do |d|
      d.build_dir = '.'
      d.ports = ['8081:8081']
      d.cmd = %w{node server.js}
      d.remains_running = true
    end
  end
end
