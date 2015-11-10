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

A decorator which injects (getValueForKey, changeValueForKey, etc)...
