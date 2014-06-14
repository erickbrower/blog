# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "xenolinguist/trusty64"
  config.vm.provision "docker"

  config.vm.provider "docker" do |d|
    d.build_dir = "."
    d.ports = ["8080:8080"]
  end
end
