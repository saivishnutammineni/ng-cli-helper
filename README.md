# ng-cli-helper

This extension helps to easily generate components, modules, services, directives, pipes with angular CLI.

Usually we have to specify the path to where the component or any thing else in the CLI command
> ex:- feature-modules/my-module/components/my-component

The problems with this approach:

1. Boring process to type long folder names especially when creating a component etc in a deep folder inside the project
2. Typos might happen
3. Need to go through the folder hierarchy till app etc
4. In a multi project we may even have to specify the project where to create the component etc.

With this extension user only has to right click on the folder in which to create the module / component etc
and select the what to create. That's all!!!. This extension will find the path to specify in the CLI command,
the project and runs the command too.