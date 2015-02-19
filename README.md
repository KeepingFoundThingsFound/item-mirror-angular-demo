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

#### Dropbox Application Authentication

In addition to having users authenticate their own dropbox accounts, we need
to provide dropbox with authentication for our application. The driver itself
is the application from the perspective of dropbox, and it must be properly
registered or it won't function.

Go to [the dropbox app portal](https://www.dropbox.com/developers/apps) and
create an application with full dropbox permissions. After creating the
application, you then need to specify the redirect URI. This needs to exactly
match what you use in your application. If you're developing locally then it's
fine to use a regular HTTP redirect, however if you develop remotely then you
must also ensure that the redirect is over __HTTPS__.

If for some reason the redirect isn't an exact match, then you will get an error during the Oauth2 process, and it will specify that the redirect doesn't match.

For this application, the redirect that I use for remote development is: `https://thordev.me:9001/misc/oauth_reciever.html`. Note how even the protocol and port need to be specified in order for it to work properly. You can however, specify multiple redirect URIs, to meet the needs of different development environments.

The dropbox-auth service also needs to know about this in order to function properly. Edit the service and update it so that:

- The authDriver uses the proper redirect URL, and
- The client credentials match that of your dropbox application

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

### Working with ItemMirror Data

We've partitioned our two routes, but we still don't have any actual data to
interact with. Let's change that by actually interacting with the data. We'll
modify our `explorer.js` controller so that it actually can display the data
we have stored in a dropbox folder.

First, make sure that the `itemMirror` service is loaded as a dependency in
addition to the `$scope`. Then we initialize the service, and create some
wrapper functions so that everything will behave properly.

To keep things simple, we'll just add the ability to delete associations, and
possibly move into the mirror of a grouping item.


#### Controller Example

Take a look at the code to see how easy is. Here's the controller:

```javascript
  	var init = itemMirror.initialize;
  	init.then(function() {
      $scope.mirror = itemMirror;
      $scope.associations = itemMirror.associations;

      // This needs to be called after the service updates the associations.
      // Angular doesn't watch the scope of the service's associations, so any
      // updates don't get propogated to the front end.
      function assocScopeUpdate() {
        $scope.associations = itemMirror.associations;
       }

      $scope.deleteAssoc = function(guid) {
        itemMirror.deleteAssociation(guid).
        then(assocScopeUpdate);
      };

      $scope.navigate = function(guid) {
        itemMirror.navigateMirror(guid).
        then(assocScopeUpdate);
      };
```

Essentially it starts up, and then defines some helper functions that we'll use in the view.

#### View Example

The HTML for the page looks like this:

```html
<h2>Fragment: {{mirror.displayName}}</h2>
<div ng-show="mirror.displayName != 'Dropbox'">
  <label>Display Name</label>
  <input ng-model="mirror.displayName"
  ng-model-options="{ getterSetter: true }"
  type="text"/>
</div>

<h1>Assoc Code</h1>
<pre>{{mirror.associations}}</pre>
<h1>Associations</h1>

<div ng-repeat="assoc in associations">
  <h3>{{assoc.displayText}}</h3>
  <pre>{{assoc}}</pre>
  <p>
    <strong>GUID: </strong> {{assoc.guid}} </br>
    <button ng-click="deleteAssoc(assoc.guid)" class="btn btn-danger">DELETE</button>
    <button class="btn btn-default" ng-click="navigate(assoc.guid)" ng-show="assoc.isGrouping">Enter</button>
  </p>
</div>
```

#### How it Works

You could take a look at the HTML and probably make an educated guess as to
what it looks like because it's so expressive. We title the view with the
displayName of the fragment, and then below that we add an input box which
allows us to edit the displayName directly!

Below that we have a list of the associations, this is just for debugging
purposes and it lists the associations as a json array.

The we get to the actual associations. the `ng-repeat` directive is used to
tell Angular that it should copy the div for _each_ association in our
associations array, and then it gives us `assoc` as a binding to the
association for that section.

We then lay out some basic info about each association. We use the displayText
of the association as a title, and also lay out any the json form of an
association for debugging. Each of the attributes listed there are accessible
for us to use for displaying information or storing information. Custom data
attributes specific to your application are also possible, and something that
will be demonstrated later on.

Finally, we have two buttons for each association. The first is a delete
button. The `ng-click` directive specifies what should happen when the button
is clicked. In this case it will call the `deleteAssoc` function and pass in
the guid of the association as the argument. The `deleteAssoc` function was
defined in our scope, and is needed for the view to properly update. The
reason for this extra function is explained by the in the comment of the
controller. Essentially, anytime the associations of the ItemMirror object
change, it needs a function that makes the change, and then calls a function
to tell Angular that the scope changed and needs to be update.

This may seem somewhat complicated, but the pattern is also applied to the
next button, navigate. Here all of the associations are updated because an
entirely new mirror is being used, so we do the same thing. Call a function,
this will do the actual work that we require of the service, and once that's
completed we tell Angular that the associations have updated.

The benefit of this is that as soon as the associations actually change, the
view updates the changes. So deleting an association will instantly remove it
from the view. This data driven model is what gives Angular so much power, and
we can now start using Angular's features to simplify our application.

#### Adding Angular Features

Let's take advantage of all the Angular features that are available to
demonstrate the power of Angular.

##### Filters

In Angular filters are used to reduce the items in an array. Let's add a
searchbox for our application that will let users search for files in the
current directory! With Angular, this is simple.

```html
<h2>Filter Associations</h2>
Search Name: <input ng-model="search.displayText">

<div ng-repeat="assoc in associations | filter:search.displayText">
```

This is all that you need to create a functional searchbox. The first two
lines are new, they specify that there should be some sort of searchbox, and
that the data we type in will be bound to `search.displayText`. Then we edit
our associations and add the filter. We specify that we want to filter by the
displayText, and we instantly have a functional search box, with just 2 lines
of code!

The Angular filters are highly extensible and can filter by every attribute
that our association has. Look at the
[documentation](https://docs.angularjs.org/api/ng/filter/filter) to see how
