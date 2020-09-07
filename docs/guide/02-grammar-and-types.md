# Grammar and Data Types

## Basics

- Swahili borrows its syntax from Javascript, Python and Ruby. Like Javascript, Swahili is case sensitive. as such the declarations below are different variables.

```
  wacha b = 5
  wacha B = 3
```

## Comments
- Swahili uses `//` for single line comments and `/*  */` for multiline comments

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

- Variables are used as symbolic names for values within the program. The names of variables, called **identifiers** must begin with either an underscore (`_` ), or an alphabetic character in either upper or lower case. Subsequent characters can be alphanumeric or an underscore. Hence:

```
wacha _jina = "Kiano" // valid
wacha Jina = "Kiano" // valid
wacha jina = "Kiano" // valid
wacha 0_jina = "Kiano" // invalid
```

- Swahili is case sensitive, hence, `Neno` and `neno` are different variables.
- You can not use Swahli keywords as identifiers.

```
  wacha kweli = uwongo // will raise an error because kweli is a Swahili keyword
```

### Declaring Variables

- To declare a variable, we use the keyword `wacha`, followed by the identifier name and an initialization. You **have to** initialize your variables when you declare them. If you want a variable to be empty on declaration you intitalize it to null (tupu).

```
wacha jina // will raise an error
wacha jina = "" // is valid
wacha jina = tupu // initializes jina to null
```

- An attempt to access an undeclared variable results in a Runtime error.
- You can not perform basic arithmetic and boolean operations on variables with a null value.


### Variable Scope

- When running the swahili interpreter on the terminal, variables you declare within a global scope (Outside of any function) can not be redeclared, ie,

```
wacha x = 3
wacha x = 5 // this line will raise an error
x = 5 // this will not raise an error
```

- Variables declared inside a function block are only available for that block. For instance:

```
  wacha a = "Outside block"
  shughuli block_example(){
    wacha a = "Inside Block"
    andika(a)
  }
  block_example() // will print "Inside Block"
  andika(a) // will print "Outside block"
```

## Data Structures and Data types

- There are 8 Data structures and Types in Swahili.
<<<<<<< HEAD
  1. Boolean: `kweli` that represents true and `uwongo` that represents false
  2. null: `tupu` denotes a null value
  3. Number: Could be both Integers and floats. For example `42` or `3.14159`
  4. Strings: A sequence of characters that represents a text value. For example `Habari`
  5. Lists: `Orodha` an ordered collection of items. Can hold multiple data types: for example `[1,2,3]` or `[1, "orodha", kweli]`
  6. Regular Expressions (RegEx) : These are patterns used to match character combinations in strings. 
  7. Date : Used to represent a date object.
  8. Objects : Stores items as **key/value pairs**
=======
  1. **Boolean `Hali`**: `kweli` that represents true and `uwongo` that represents false
  2. **null `tupu`**: Denotes a null value
  3. **Number `Nambari`**: Could be both Integers and floats. For example `42` or `3.14159`
  4. **Strings `Jina`**: A sequence of characters that represents a text value. For example `Habari`
  5. **Lists `Orodha`**: An ordered collection of items. Can hold multiple data types: for example `[1,2,3]` or `[1, "orodha", kweli]`
  6. **Regular Expressions `RegEx`**: These are patterns used to match character combinations in strings. 
  7. **Date `Tarehe`**: Used to represent a date object.
  8. **Dictionary `Kamusi`**: Works like a dictionary by storing items as **key/value pairs**
>>>>>>> 6596a6c9ac4d654c50b9df2134a316af7e0df415

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
  andika(vinywaji/0)
>>"chai"
  andika(vinywaji/2)
>>"Kahawa ya Kenya"
```

### Appending elements to a list

- To append an element to the end of a list we use the plus sign(`+`) followed by the element we want to add. For Example

```
vinywaji = vinywaji + "soda"
andika(vinywaji)
>>["chai", "kahawa ya Uhabeshi", "Kahawa ya Kenya", "soda" ]
```

### Deleting elements in a list

- To delete an element in a list we use the `-` followed by the index of the element. For Example:

```
vinywaji = vinywaji - 3
andika(vinywaji)
>>["chai", "kahawa ya Uhabeshi", "Kahawa ya Kenya" ]
```

### Concatenation of 2 lists

- We can combine 2 lists into one using an asterisk (`*`)
- For Example:

```
  wacha vyakula = ["maandazi", "wali", "mahamri"]
  wacha vyakula_vinywaji = vinywaji * vyakula
  andika(vyakula_vinywaji)
  >> ["chai", "kahawa ya Uhabeshi", "Kahawa ya Kenya", "maandazi", "wali", "mahamri"]
```

### Length of a list

- To get the length of a list, (how many elements are in a list) we use the inbuilt function `idadi()`.
- For Example:

```
vinywaji.idadi()
>> 3
```

### Largest element in a list
- To find the largest element in a list of numbers, we use the method `kubwa()`. 
```
  wacha l = [1,2,4,12,56,887]
  andika(l.kubwa()) // Get the largest element of the list l
  >> 887
```
### Smallest element in a list
- To find the smallest element in a list of numbers, we use the method `ndogo()`. 
```
  wacha l = [0.1,2,0.04,12,56,887]
  andika(l.ndogo()) // Get the smallest element of the list l
  >> 0.04
```

### Replace an element in a list
- To replace an element in a specific index of the list you can use the `weka()` method. It takes 2 arguments, the first is the index of the element to be replaced and the second is the value to replace it with. 
- It has been explained further [here](../ref/built-in-functions.md)
- For Example: 
```
  wacha x = [1,2,3]
  andika(x.weka(0,12)) // Replace the element in index 0 with the value 12
  >> [12,2,3]
```

### Joining a list into a string
- This is achieved using the `unga()` method. The method takes one parameter, which is the delimiter. The delimiter must be a string
- For Example:
```
  wacha jina = ["w", "e", "n", "d", "o"]
  andika(jina.unga("")) 
  >> "wendo"
```

### Checking if a list has a specific element. 
- To do this, we use the `ina()` method, that returns a boolean(`kweli` or `uwongo`). The parameter passed is the element being searched for.
- For example, to check if a list has the value of pi (`3.142`):
```
  wacha nambari = [2.718, 3.142, 1.618]
  andika(nambari.ina(3.142))
  >> kweli
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

### Convert a String to Uppercase
- To capitalize a string, we use the inbuilt `herufiKubwa()` method. 
- For Example: 
```
  wacha x = "habari"
  andika(x.herufiKubwa()) // Will print "HABARI"
```

### Splitting a string into a list
- To split a string into an array we use the `tenga()` method. The method takes in a delimiter that allows Swahili to know where to split the string. The delimiter must be a string and it can not be null. 
- For example: 
```
  wacha x = "This is a sample string"
  andika(x.tenga(" ")) // Split the string everytime it encounters a space. 
  >> ["This", "is", "a", "sample", "string"]
```
- If you want to get individual characters of a string, you split it with the delimiter `("")`. For instance:
```
  wacha x = "Wendo"
  andika(x.tenga(""))
  >> ["W","e","n","d","o"]
```

### Replacing a substring within a string.
- This is done using the inbuilt `badili()` method. It takes two parameters; The substring to be replaced, and the substring to replace it with. 
- For example:
``` 
  wacha x = "Habari Dunia"
  andika(x.badili("Dunia", "Wendo"))
  >> "Habari Wendo"
```

### Convert a String to Lowercase
- To convert a string to lowercase, we use the inbuilt  `herufiNdogo()` method
- For Example
```
  wacha x = "HABARI"
  andika(x.herufiNdogo()) // Will print "habari"
```


## Special Characters

- In addition to ordinary characters you can also require special characters in strings.
- For Example

```
andika("habari \n yako")
>> habari
   yako
```

- The charaters `\n` add a new line. The list of special characters is shown below

| Character | Meaning      |
| --------- | ------------ |
| \n        | New line     |
| \t        | Tab space    |
| \"        | Double quote |


## Regular Expressions (RegEx)
- These are patterns used to match character combinations in strings. 
- To declare a RegExp we use the RegEx() function. The function takes in 2 arguments; A RegEx pattern and a RegEx flag. ` RegEx("pattern", "flag")`
- For Example: 
```
  wacha a = RegEx("ab+c", "g")
  // This Pattern will return RegEx: /ab+c/g
```

## Date
- Used to represent a date object. The keyword used to initialize a date is `Tarehe()`.
```
  wacha s = Tarehe()

```
- For more information, check [here](../ref/built-in-functions.md) and [here](./07-numbers-and-dates.md)


## Kamusi
A data structure that stores items as **key/value pairs**. 

Syntax: `wacha var = {key_1: value_1, key_2: value_2}`

For example: 
```
  wacha mtu = {
    jina: "Wendo", 
    umri: 21,
    urefu : 180
    }
```

<<<<<<< HEAD
This then allows us to get specific values by checking their keys. For instance `mtu.jina` would return `"Wendo"`
=======
This then allows us to get specific values by checking their keys. For instance `mtu.jina` would return `"Wendo"`


//add type methods
>>>>>>> 6596a6c9ac4d654c50b9df2134a316af7e0df415
