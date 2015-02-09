# Item Mirror Angular Tutorial

## Getting Started

### NPM, Grunt, and Bower

NPM, Grunt and Bower are systems that aren't required for javascript
development, but have a lot of features that make it much, much
easier. These can be installed on all platforms with ease.

1. [NPM](http://blog.npmjs.org/post/85484771375/how-to-install-npm)
2. [Grunt](http://gruntjs.com/installing-grunt)
3. [Bower](http://bower.io/#install-bower)

### Compass

Compass is a requirement for [Sass](http://sass-lang.com/). Sass is
short for syntactically awesome stylesheets. It's an extension of
regular CSS that's 100% compatible with ordinary CSs, but has
extremely useful features like variables.

You'll need to install Compass on your machine in order to get it
working. It's built on ruby, so that will also need to be
installed. Follow the [installation instructions here](http://compass-style.org/install/).

### Yeoman Scaffolding

The first thing that you need to do is handle all of the boilerplate
that comes with a web application. There’s many different components
to modern webapps, and setting things up manually can be a bit of a
pain. Luckily, Yeoman exists to make starting an application easy, by
setting up grunt, HTML, and CSS automatically with sane defaults.

Start by installing Yeoman with npm

```bash
$ npm install -g yo
```

For our application, we’re going to use Angular.js. It’s a full
fledged MVC framework, that’s easy to get started with. There are many
available MVC frameworks that could be chosen instead, and you can try
another if you feel more comfortable with it (e.g. Ember, Backbone).

We also need to install a yeoman generator for Angular in order to
actually use it, so do that quickly. The
[documentation](https://github.com/yeoman/generator-angular) goes over
the many uses it has for an Angular project.

```bash
$ npm install -g generator-angular
```

Now that we have the generator for an angular application, we can get to work.

```bash
$ yo angular $NAME_OF_APPLICATION
```

This will generate our application structure. It will ask you a couple
of questions about how you want to use angular. You’ll want the
default options that it comes with. Be sure that the animation, route,
and touch modules are included in the installation, but the can be
added later if you accidently forget to include one.

Now that we have the scaffolding finished, we need to use npm and
bower to install the necessary dependencies for the application.

### Bower and NPM packages

```bash
$ bower install
$ npm install
```

This will generate our application structure. It will ask you a couple
of questions about how you want to use angular. You’ll want the
default options that it comes with. However, when selecting different
services for angular, only the angular-animate and angular-touch
services will likely be relevant for your application. However, be
sure to include angular-route as well. Now that we have the
scaffolding finished, we need to use npm and bower to install the
necessary dependencies for the application.

```bash
$ bower install https://github.com/KeepingFoundThingsFound/itemMirror.git --save
```

Bower will install the lastest version of ItemMirror directly from the
Github repository. This method of package management can save us quite
a few organizational headaches, and makes updating packages simple if
we want to. You could also just download the files or clone the
repository manually if desired.

### Editing the Wiredep Task

One little adjustment that we need to make is editing the wiredeps
grunt task. Specifically, we need to add a couple of file exclusions
to make sure that everything runs smoothly. Edit `Gruntfile.js` and under the `wiredep.ask` task add the following:

```javascript
exclude: ['jquery.js', 'bootstrap.js'], // Interferes with Angular

```

This is done to prevent jquery and bootstrap's js from loading. Each of these interferes with the way Angular manipulates the DOM, and can lead to some strange bugs.

### Enabling Boostrap Directives

You might wonder how we utilize all of the cool UI elements that
bootstrap comes with if we disable the bootstrap. Not to worry,
there's a fantastic Angular bootstrap module that provides all of the
javascript in the form of Angular friendly directives.

It's called
[Angular-Strap](http://mgcrea.github.io/angular-strap/). We're going
to install it with bower, and then add it to the list of modules to
load.

```bash
$ bower install angular-strap --save
```

Then edit `app/scripts/app.js`, and under the list of modules to load you'll add the new Angular-Strap module.

```javascript
Angular
  .module('portfolioApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngTouch',
    'mgcrea.ngStrap' // this is the line you add
  ])
```

### Testing to make sure it all works

There's a lot of libraries and setup that we've gone through at this
point, and before going any further, you should test to make sure
everything is running smoothly before charging ahead.

Run the following grunt task

```bash
$ grunt serve
```

This creates a local webserver that will render our Angular
application as it currently stands. Your favorite browser should
automatically open up with the page rendered under
`http://localhost:9000`. Since we haven't made any edits, it should
show the default Yeoman scaffolding page. Go into the console and
check to make sure jquery and bootstrap haven't loaded as well.

## Item Mirror Specific Setup

Now that everything is set up, we’re finally ready to begin writing
some stuff. Before we begin altering the interface and creating our
simple little application, we need to start at an abstract level. It’s
best to start off by writing the views, controllers, models, and
routes between angular and our application. This is the most critical
step, because it’s how the data will flow in our program. Luckily
ItemMirror is easy to adapt to any type of MVC framework.

Angular is such a popular library that there are many articles out
there that can give a much more comprehensive set of information about
each component, and [I encourage you to read them](https://docs.angularjs.org/tutorial) if you don’t
understand, rather than copying and pasting the code here.

[The documentation](https://docs.angularjs.org/api) is also quite exhaustive and should be used to get a
better understanding of how the library works.

Now we do have to do a bit of hacking in order to get an MVC framework
operating properly. The reason for this is because instead of having
our model be based on a RESTful interface, we’re getting all of our
data through the ItemMirror. It’s slightly unconventional, but all of
these frameworks are flexible enough to allow for this.

### The Item Mirror Services

In Angular, a service is a way of sharing persistent data between
controllers. The functionality it provides is just what we need to
take advantage of ItemMirror, which can be thought of as a data
portal. We’ll use Yeoman’s built in scaffolding to get us started

```bash
$ yo angular:factory item-mirror
```

Yeoman automatically creates the files and folders both for the
service, and any associated tests. Take a look at what’s inside of
`app/scripts/services/item-mirror.js`. It’s taken care of the boiler
plate for the service so that we can start writing. The service is
actually one of the most complex parts of the application since it has
to wrap around every single ItemMirror method to work properly with
Angular. __If using another framework, study this file carefully__,
it’s the most critical to getting ItemMirror to work with web
framework.

Since actually writing this service is a complicated task, just copy
the file from this repository and trust that it (mostly) works.

### Dropbox Authentication

Another service that we need to create is the dropbox authentication
service. In the future this type of work will be done directly through
Item Mirror, but for now we need to get dropbox authentication to work
directly in our application.

Create a services with Yeoman as we did with item-mirror. Call it
dropbox-auth.

```bash
$ yo angular:factory dropbox-auth
```

Once again, just copy this file and observe it instead of trying to
create the service from scratch.

Note that this factory also needs access to the official `Dropbox.js`
library, but we never installed it! Let’s take a moment to do that
right now.

```bash
$ bower install dropbox-build --save
```
### An Aside on Testing within Angular

Angular is a very test driven framework, and it provides the tools for
us to write tests for _everything_ we write. Due to the prototypical
nature of the ItemMirror project, test's aren't exactly something that
are ironed out for our services, and it's not expected that you create
tests for everything, but I'll give a short introduction as to how and
why.

First install the grunt-karma package for grunt so that you can actually run the tests.

```bash
$ npm install --save-dev grunt-karma
```

The `--save-dev` option means that it saves the file as a development
dependency rather than an ordinary one. So people looking to use the
application have no need for it, but developers certainly do need
it. Bower has a corresponding option as well for it’s packages.

If we run the tests as they are right now, they actually will fail!
Try it, and you’ll get a complaint about Dropbox not existing. That’s
because karma never loaded up the dropbox library. Edit
`test/karma.conf.js`, and add both the Item Mirror and Dropbox libraries
under the files to load. Their paths are

- `bower_components/dropbox-build/dropbox.js`
- `bower_components/item-mirror/item-mirror.js`

Now run grunt test again and you’ll find that all of the tests
successfully passed! However we don’t have any real tests defined for
our services. Edit `test/spec/services/dropbox-auth.js` and add some
simple test. It could literally be anything.

First note the distinction between the test runner and test
library. Our test runner is
[Karma](http://karma-runner.github.io/0.12/index.html), and most of
the details for that are handled automatically through a grunt
task. The test library however is
[Jasmine](http://jasmine.github.io/): it defines the syntax in
javascript for actually writing tests.

For information about how to write tests, and utilize Jasmine and
Angular together,
[take a look at this tutorial](http://nathanleclaire.com/blog/2014/04/12/unit-testing-services-in-angularjs-for-fun-and-for-profit/). The
biggest concept to understand is how to utilize
[dependency injection](https://docs.angularjs.org/guide/di) to write
proper tests.

## Diving into the Application

Now that the setup for everything is complete, we can begin writing
some actual code and start developing our application!

### Replacing the Yeoman Defaults

Yeoman was kind enough to add some default content for us to look at,
but we aren't exactly interested in keeping it. Let's replace the
Yeoman stuff with a welcome page that explains what this application
is, and a big button that actually starts the application.

Everything starts at `app/index.html`, so take a peek into there to
see how things function. Here we essentially have access to the header
and footer of the application. However, when we start the application
there's all of this extra stuff from Yeoman. Where is that?

Well between the header and footer there's a single directive:
`ng-view`, and this loads whatever section of the application we tell
it to based on our location. Pretty nifty!

The actual content that it's loading is coming from
`app/views/main.html`. If you edit that file then you'll instantly see
the changes reflected. Along with the view is a controller at
`app/scripts/controllers/main.js`. We aren't going to tinker around
with the scope for our welcome area, so just leave that alone for now.

These routes are defined in `app/scripts/app.js`. Since we'll just be using the main and explorer routes, let's get rid of the 'About' route, and remove the controller and view that comes with it.

```bash
rm app/scripts/controllers/about.js
rm app/views/about.html
```

- Edit the pills in the header so that theres just two: welcome and explorer
- Make sure that ng-ref for explorer pill is also defined

Edit the HTML of the main view:

- Get rid of the default Yeoman stuff
- Add a big green button in the middle, and have it link to the explorer view: `ng-ref="#/explorer"

Now we're going to create a route with Yeoman. A route will has a controller and a view (and tests).

```bash
yo angular:route explorer
```

If everything's working like it should, then you should be able to
click the button in the middle of the screen and it will update the
view on the page. The pills should also work for navigating between
views. You can even go back in history and it will go to the previous
view; a really useful feature of routes.

If it isn't working like it should, take a look at the console to see
if you can pinpoint any errors.

From here, you can start customizing the CSS if you desire and even
add animations. Angular's documentation gives examples of using
animations for almost all of it's directives, and these play nicely
with bootstrap. Edit main sass file `app/styles/main.scss`.
