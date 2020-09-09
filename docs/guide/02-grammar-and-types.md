# Grammar and Data Types

## Basics

Swahili borrows its syntax from Javascript, Python and Ruby. Like Javascript, Swahili is case sensitive. as such the declarations below are different variables.

```
wacha b = 5
wacha B = 3
```

## Comments

Swahili uses `//` for single line comments and `/* */` for multiline comments

```
// This is a single line comment

/*  This
    is
    a
    Multiline
    Comment
*/
```

## Variables

Variables are used as symbolic names for values within the program. The names of variables, called **identifiers** must begin with either an underscore ( `_` ), or an alphabetic character in either upper or lower case. Subsequent characters can be alphanumeric or an underscore. Hence:

```
wacha _jina = "John"  // valid
wacha Jina = "John"   // valid
wacha jina = "John"   // valid
wacha 0_jina = "John" // invalid
```

Swahili is case sensitive, hence, `Neno` and `neno` are different variables.

You cannot use Swahli keywords as variable names.

```
wacha kweli = uwongo // will raise an error because kweli is a Swahili keyword
```

### Declaring Variables

To declare a variable, we use the keyword `wacha`, followed by the identifier name and an initialization. You **have to** initialize your variables when you declare them. If you want a variable to be empty on declaration you intitalize it to null (tupu).

```
wacha jina        // will raise an error
wacha jina = ""   // is valid
wacha jina = tupu // initializes jina to null
```

- An attempt to access an undeclared variable results in a Runtime error.
- You can not perform basic arithmetic and boolean operations on variables with a null value.

### Variable Scope

Variables you declare within a global scope (outside of any function) cannot be redeclared, ie,

```
wacha x = 3
wacha x = 5 // this line will raise an error
x = 5       // this will not raise an error
```

- Variables declared inside a function block are only available for that block. For instance:

```
  wacha a = "Outside block"
  shughuli block_example() {
    wacha a = "Inside Block"
    andika(a)
  }
  block_example() // => "Inside Block"
  andika(a)       // => "Outside block"
```

## Data Structures and Data types

- There are 8 Data structures and Types in Swahili.
  1. **Boolean `Hali`**: `kweli` that represents true and `uwongo` that represents false
  2. **null `tupu`**: Denotes a null value
  3. **Number `Nambari`**: Could be both Integers and floats. For example `42` or `3.14159`
  4. **Strings `Jina`**: A sequence of characters that represents a text value. For example `Habari`
  5. **Lists `Orodha`**: An ordered collection of items. Can hold multiple data types: for example `[1,2,3]` or `[1, "orodha", kweli]`
  6. **Regular Expressions `RegEx`**: These are patterns used to match character combinations in strings.
  7. **Date `Tarehe`**: Used to represent a date object.
  8. **Object `Kamusi`**: Works like a dictionary by storing items as **key/value pairs**

## List literals

- A list literal is a collection of zero or more expressions, each of which represents a list element enclosed in square brackets. The length of a list is set to the number of arguments specified.
- The following creates a list of `vinywaji`

```
wacha vinywaji = ["chai", "kahawa ya Uhabeshi", "Kahawa ya Kenya" ]
```

- Lists in Swahili are zero based, which means that the first element has the index of zero.

### Acessing Elements in a list

- Unlike most languages access a specific element in an array we put the index after a forward slash. For example

```
  wacha vinywaji = ["chai", "kahawa ya Uhabeshi", "Kahawa ya Kenya" ]
  andika(vinywaji/0) // => "chai"
  andika(vinywaji/2) // => "Kahawa ya Kenya"
```

### Appending elements to a list

- To append an element to the end of a list we use the plus sign(`+`) followed by the element we want to add. For Example

```
vinywaji = vinywaji + "soda"
andika(vinywaji) // => ["chai", "kahawa ya Uhabeshi", "Kahawa ya Kenya", "soda" ]
```

### Deleting elements in a list

- To delete an element in a list we use the `-` followed by the index of the element. For Example:

```
vinywaji = vinywaji - 3
andika(vinywaji) // => ["chai", "kahawa ya Uhabeshi", "Kahawa ya Kenya" ]
```

### Concatenation of 2 lists

- We can combine 2 lists into one using an asterisk (`*`)
- For Example:

```
  wacha vyakula = ["maandazi", "wali", "mahamri"]
  wacha vyakula_vinywaji = vinywaji * vyakula
  andika(vyakula_vinywaji) // => ["chai", "kahawa ya Uhabeshi", "Kahawa ya Kenya", "maandazi", "wali", "mahamri"]
```

## Boolean literals

- The boolean type has 2 literal values: `kweli` and `uwongo`

## Numeric literals

- The Number type contains both floats and integers.
- Swahili deals only with numbers in base ten, ie, `decimal number system`
- Examples of numeric literals are:
  `1,100, 3.14159, 2.71828`

## String literals

- A string literal is zero or more characters enclosed in double(`" "`) quotation marks. Swahili does not support use of single quotation marks to denote strings, hence `andika('Habari Dunia')` is invalid but `andika("Habari Dunia")` is valid.

## Special Characters

- In addition to ordinary characters you can also add special characters to strings.
- For Example

```
  wacha a = "habari \n yako"
```

- The charaters `\n` add a new line. The list of special characters is shown below

| Character | Meaning      |
| --------- | ------------ |
| \n        | New line     |
| \t        | Tab space    |
| \"        | Double quote |

## Regular Expressions (RegEx)

- These are patterns used to match character combinations in strings.
- To declare a RegExp we use the RegEx() function. The function takes in 2 arguments; A RegEx pattern and a RegEx flag. `RegEx("pattern", "flag")`
- For Example:

```
  wacha a = RegEx("ab+c", "g")
  andika(a) // => /ab+c/g
```

## Dates

- Used to represent a date object. The keyword used to initialize a date is `Tarehe()`.

```
  wacha s = Tarehe()
```

- For more information, check [here](../ref/built-in-functions.md) and [here](./07-numbers-and-dates.md)

## Object Literals

An object literal is a list of zero or more pairs of property names and associated values of an object, enclosed in curly braces (`{}`).

For example:

```
  wacha mtu = {
    jina: "Wendo",
    umri: 21,
    urefu : 180
  }
```

This then allows us to get specific values by checking their keys. For instance `mtu.jina` would return `"Wendo"`
