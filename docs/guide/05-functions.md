# Functions

## Declaring Functions

The keyword for building functions is Shughuli.
A function definition/declaration consists of: - The name of the function - A list of parameters to the function, enclosed in the parentheses and separated by commas. - The swahili statements that define a function ,enclosed in curly brackets `{...}`
For Example:

```
  shughuli Salimu(jina){
    andika("Habari, " + jina)
  }
```

The function `Salimu` takes one parameter called `jina`. The function consists of one statement that says to return the concatenated string `Habari` and the parameter passed into `jina`.

## Calling Functions

_Defining_ a function does not execute it. Defining simply names the function and specifies what to do when the function is called.

**Calling** the function actually performs the functions specified with the indicated parameters. For Example:

```
Salimu("Wendo")
```

The preceding statement calls the function with an argument `"Wendo"`. Once it executes, it returns the value `"Habari, Wendo"`

## Function Scope

Variable defined inside a function cannot be accessed outside the function because the variable defined is only in the scope of the function. However, a function can access all the variables and functions defined inside the scope in which it is defined

In other words, a function defined in the global scope can access all variables defined in the global scope. A function defined inside another function can also access all variables defined in its parent function, and any other variables to which the parent function has access.

## Recursion

A function can refer to and call itself. There are three ways for a function to refer to itself: - The Functions name - an in-scope variable that refers to the function

For Example:

```
wacha foo = shughuli bar(){

}
```

Within the function body, the following are equivalent 1. bar() 2. foo()
A function that calls itself is called a `recursive function`. Both execute the same code multiple times, and both require a condition (to avoid an infinite loop, or rather, infinite recursion in this case).
