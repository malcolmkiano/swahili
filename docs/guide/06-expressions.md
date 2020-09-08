# Expressions and Operators

Swahili has the following operators: - Assignment Operators - Comparison Operators - Arithmetic Operators - Logical Operators

## Assignment Operators

Currently, the only assignment operator we support is `=`

For instance;

`wacha x = 5` assigns the value 5 to the variable x.

## Comparison Operators

| Operator                       | Description                                                                           | Example returning true |
| ------------------------------ | ------------------------------------------------------------------------------------- | ---------------------- |
| Equal(`==`)                    | Returns true(`kweli`) if operands are equal                                           | `3 == 3`               |
| Not Equal (`!=`)               | Returns true(`kweli`) if operands are not equal                                       | `2 != 1`               |
| Greater Than(`>`)              | Returns true(`kweli`) if the operand on the left is greater than the right operand    | `5 > 2`                |
| Greater Than or Equal to(`>=`) | Returns true if the operand on the left is greater than or equal to the right operand | `5 >= 2`               |
| Less Than(`<`)                 | Returns true(`kweli`) if the operand on the left is less than the right operand       | `5 < 2`                |
| Less Than or Equal to(`<=`)    | Returns true if the operand on the left is less than or equal to the right operand    | `5 <= 2`               |

## Arithmetic Operators

These are operators that take numerical values as their operands and return a single numerical value. The standard arithmetic operators are addition(`+`), subtraction(`-`), division(`/`) and multiplication(`*`).

| Operator                      | Description                                                                                                                     | Example.                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Addition(`+`)                 | adds the left operand to the right operand                                                                                      | `2 + 3` returns `5`                |
| Subtraction(`-`)              | subtracts the right operand from the left operand                                                                               | `2 - 3` returns `-1`               |
| Division(`/`)                 | divides the left operand by the right operand                                                                                   | `6 / 3` returns `2`                |
| Multiplication(`*`)           | multiplies the left operand by the right operand                                                                                | `2 * 3` returns `6`                |
| Unary Negation (`-`)          | Unary Operator, returns negation of its operand                                                                                 | if `x == 3` then `-x` returns `-3` |
| Exponentiation operator (`^`) | Calculates the `base` to the `exponent` power. that is if the base is 2 and the exponent is 3 then, it calculates 2<sup>3</sup> | `3 ^ 2` returns `9`                |
| Modulus(`%`)                  | Returns the remainder of division between the left hand operand and the right hand operand                                      | `8 % 3` returns `2`                |

## Logical Operators

Logical operators are typically used with Boolean (logical) values. When they are used, they return a boolean value.

| Operator           | Usage          | Description                                                                                                                                                                                                           |
| ------------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Logical AND(`&&`)  | expr1 && expr2 | When used with Boolean values, it returns `true` if both operands are `true`, otherwise it returns `false`. When used with Strings, it will return the latter (`expr2` in this case) if `expr1` is truthy             |
| Logical OR(`\|\|`) | expr1          |                                                                                                                                                                                                                       | expr2 | When used with Boolean values, it returns `true` if either operand is `true`, otherwise it returns `false` when both operands are `false`. When used with Strings, it will return the first truthy value it encounters. |
| Logical NOT(`!`)   | !expr1         | Returns `false` if it applied on a single operator that can be converted to `true`, otherwise, returns `false`. When used on lists, (`!orodha`), it returns `true` if the list is empty, otherwise it returns `false` |

## String Operators

The concatenation (`+`) operator can be used to concatenate 2 strings together. It returns another string that is the union of the two operand strings

For example:

```
andika("Habari " + "yako")
>> Habari Yako
```

- It can also be used with variables, for instance:

```
wacha jina = "Wendo"
andika("Habari" + jina)
>> Habari Wendo.
```
