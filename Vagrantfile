# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.provider "docker" do |d|
    d.image = 'postgres:9.4'
  end

  config.vm.provider "docker" do |d|
    d.build_dir = '.'
  end
end
