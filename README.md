# react-validated-form

This is the form library for you if the following assumptions apply to you...

- Validations
- Validations on discrete events (form enter, n seconds after some text is entered)
- Text input to not show error immediately after edit/during editing
- "Stateful" forms, where the state of the form is kept only as long as the form is alive, and destroyed if the owner of the form is cancelled, etc...
- Transforms
- Easy, declarative API
- No opinions on how you lay out your form or what component you use to display the data, react-validated-form gives you a few defaults but only really cares about how the different parts (state storage, validation calculation, view layer) work with each other, not how they work within themselves

In reality, this validated-form library is more of a suggestion for architecting forms. The implementation is a little more opinionated in that the particular decorators/components we provide is just one implementation.

There are really a couple of cool things

# Exported modules

## ValidatingValue

`Record`

```js
const ValidatingValue = Record({
  text: '', // String
  required: false, // Bool
  transform: null, // String
  validation: null, // String
  shouldValidate: false, // Bool
});
```

This is the core "innovation" of `react-validated-form`. In regular React `<input/>` elements, values are represented as `String`s. This makes it extremely easy to reason about the application and predict its state. We decided to take that concept and add validation to this singleton idea. Each validated value contains its raw text for display purposes, but also its validation (discussed later).

From this we added a few other features. We found that required inputs and non-required inputs were common enough that there should be a convenience `required` key. Keys that are required will be validated against their validation, but keys that aren't required and are blank are not validated at all, this saves us from having validation functions each account for the required-ness of an input.

Transform was something we built on top of validation because we often allow users enter values like `80%` when the system only cares about a `0.8`, or 'heLlOwOrld@examPle.com' when the system only cares about 'helloworld@example.com'. Transforms allow each ValidatedValue to change its representation (and then validate against the new validation).

(TODO: Discuss the shape of the validation and transform strings).

Lastly, the shouldValidate key allowed us to distinguish between two key states of any form:
1. Currently entering input, and
2. Needing validation

We don't want to annoy our users by showing a red invalid sign as they are entering their email, for example, so shouldValidate is set to false. At the same time, after we validate a form and something's wrong, we don't want to keep showing that it's wrong when a user has started to edit it (but hasn't finished just yet), so in this case, shouldValidate can be turned off.

## createForm

`func (config, Component) -> Component`

`createForm` is a function which returns a higher order component based on a configuration. This higher order component's primary purpose is to hold the state of the form, so use this function to transform a component that requires the entire form state (current values of all the fields).

This higher order component injects 3 properties into its children.

### getValueForKey

`func (String) -> ValidatingValue`

This function allow you to pass a key, and it returns a validated value which you can pass into a display component.

### changeValueForKey

`func (String) -> func`

This function allows you to pass a key, and it returns a function which acts as a handler for an onChange. It maybe helpful to look into the code to see what it's actually doing. In addition to handling changes to input values, it also will mark those inputs as not currently validating. If you enter an invalid email, and start editing it, any visual error should disappear.

### checkForValidValues

`func () -> Promise`

This function returns a promise. If all the values are validated, then the Promise will resolve with an Immutable.Map representing the successful validated state, otherwise, the Promise is rejected (and you can do something here if you need to).

## Form

`Component`

`prop onSubmit: func` - What action to take when the form is trying to be submitted.

The form component is actually quite simple. It acts as a `<form>` container but allows you to specify a submit action for when a user hits the return key. It isn't doing anything else except rendering its subtree as a normal `<form>` would. This is one of the important design decisions of `react-validated-form`. Although the `createForm` function is often called on the Component that contains within it a `<Form/>`, that doesn't have to be the case! Also, you'll notice that the state is kept on the higher level component and the actual form itself is just a brainless child.

## FormInput

`Component`

`prop value: ValidatingValue`  
`prop onChange: func`

This is a curious component. One of the other key design decisions of `react-validated-form` is that the UI for inputs should not be heavily tied to any of the validation logic. At Edusight, this component is often switched out for something else that takes the same input properties, so this is more of a model component for your study. The validated value is passed in, often through something like `getValueForKey()`, and contains all the data necessary for the input itself to determine its error state, using the `gerError` function (as described below). The onChange handler acts exactly like the onChange handler of a generic React `<input/>`, and is often passed down through `changeValueForKey()`. In this example input, an error is shown if `gerError` finds an error.

## getError

`func (ValidatingValue) -> String?`

This function takes a ValidatingValue and checks to see if it validates. If there is an error, it returns a non-null string value containing a description of the error, otherwise it returns `null`.

## getFirstErrorInMap

This is more of an internal function which will save computation time by only finding the first error in an Immutable.Map of ValidatingValues. If one value fails, then generally no further action needs to happen.
