# Control Flow & Error Handling

## Conditional Statements.

A conditional statement is a set of commands that executes if a specified condition is true.

### If...else (`kama...sivyo`) statement

Use the `kama` statement to execute a statement if a logical condition is true. Use the optional `sivyo` clause to execute a statement if the condition is false.

A `kama` statement looks like this:

```
kama (condition) {
  statement_1
} sivyo {
  statement_2
}
```

Here, the `condition` can be any expression that evaluates to `kweli` or `uwongo`.

You can also compound the statements using `au` to have multiple conditions tested in sequence, as follows:

```
kama (condition_1) {
  statement_1
} au (condition_2) {
  statement_2
} au (condition_n) {
  statement_n
} sivyo {
  statement_last
}
```

## Exception handling statements

You can handle runtime exceptions using the `jaribu...iwapo` statements

### `jaribu...iwapo` statement

You can throw exceptions using the `tupa` statement and handle them using the `jaribu...iwapo` statements

#### `tupa` statement

Use the `tupa` statement to throw an exception. A `tupa` statement specifies the value to be thrown:

```
tupa expression
```

The `jaribu...iwapo` statement marks a block of statements to try, and specifies one or more responses should an exception be thrown. If an exception is thrown, the `jaribu...iwapo` statement catches it.

The following example uses a `jaribu...iwapo` statement. The example calls a function that divides two numbers. If the value for y is `0`, an exception is thrown since division by 0 is invalid, and the statements in the `iwapo` block set the _`jibu`_ variable to 0.

```
shughuli gawa(x, y) {
  rudisha x / y
}

jaribu { // statements to try
  jibu = gawa(12, 0) // function could throw exception
} iwapo (shida) {
  jibu = 0
  andika(shida)
}
```

#### The `iwapo` block

You can use a `iwapo` block to handle all exceptions that may be generated in the `jaribu` block.

```
iwapo (shida) {
  statements
}
```

The `iwapo` block specifies an identifier (_`shida`_ in the preceding syntax) that holds the value/message of the exception. You can use this identifier to get information aobut the exception that was thrown.

```
jaribu {
  tupa 'My exception (shida yangu)' // generates an exception
} iwapo (shida) {
  // statement to handle any exceptions
  andika(shida) // log exception to console
}
```

#### The `mwishowe` block

The `mwishowe` block contains statements to be executed after the try and catch blocks execute. Additionally, the `mwishowe` block executes before the code that follows the `jaribu...iwapo...mwishowe` statement.

```
funguaFaili()

jaribu {
  andikaFaili(data) // this may throw an error
} iwapo (shida) {
  chunguzaShida(shida) // if an error occurred, handle it
} mwishowe {
  fungaFaili() // always close the resource
}
```
