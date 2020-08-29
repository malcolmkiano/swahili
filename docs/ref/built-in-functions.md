# Built-in functions

## I/O

- **andika(`ujumbe: SWString`): `SWNull`**<br/>
  Prints `ujumbe` to the console.

- **soma(`swali: SWString`): `SWString`**<br/>
  Gets and returns user input as a string. Uses the value of `swali` as a prompt message

- **somaNambari(`swali: SWString`): `SWNumber`**<br/>
  Gets and returns user input as a number. Uses the value of `swali` as a prompt message

- **futa(): `SWNull`**<br/>
  Clears the console window

## Type methods

### Checking type

- **niNambari(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWNumber`

- **niJina(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWString`

- **niOrodha(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWList`

- **niShughuli(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWBaseFunction`

### Type casting

- **Nambari(`kitu: SWString | SWBoolean | SWNumber`): `SWNumber`**<br/>
  Returns an `SWNumber` representation of the value passed in

- **Jina(`kitu: any`): `SWString`**<br/>
  Returns an `SWString` representation of the value passed in

- **Tarehe(`siku: SWDateTime | SWString, [muundo: SWString]`): `SWDateTime`**<br/>
  Returns the current date if the only parameter entered is `siku`. Returns a formatted date and time if `muundo` matches the formatting strings.

  For info on `SWDateTime` formatting, read [the guide](../guide/07-numbers-and-dates)

### Modification and reading

- **idadi(`kitu: SWList | SWString`): `SWNumber`**<br/>
  Returns the length of a list or string

- **badili(`orodha: SWList, pahala: SWNumber, kitu: any`): `any`**<br/>
  Modifies an `SWList` in place by replacing the element at the index `pahala` with the value provided for `kitu`. Returns the new value of `kitu`

- **unga(`orodha: SWList, kiungo: SWString):`SWString`**<br/>
  Converts an `SWList` to an `SWString` by joining the elements with the value of `kiungo`

- **tenga(`jina: SWString, kitengo: SWString`): `SWList`**<br/>
  Converts an `SWString` to an `SWList` by splitting each section delimited by the value of `kitengo`
