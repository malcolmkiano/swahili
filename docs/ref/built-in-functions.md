## Built-in functions

- **andika(`ujumbe: SWString`): `SWNull`**<br/>
  Prints `ujumbe` to the console.

- **soma(`swali: SWString`): `SWString`**<br/>
  Gets and returns user input as a string. Uses the value of `swali` as a prompt message

- **somaNambari(`swali: SWString`): `SWNumber`**<br/>
  Gets and returns user input as a number. Uses the value of `swali` as a prompt message

- **futa(): `SWNull`**<br/>
  Clears the console window

- **niNambari(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWNumber`

- **niJina(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWString`

- **niOrodha(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWList`

- **niShughuli(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWBaseFunction`

- **idadi(`kitu: SWList | SWString`): `SWNumber`**<br/>
  Returns the length of a list or string

- **tarehe(`siku: SWDateTime, [muundo: SWString]`): `SWDateTime`** <br/>
  Returns the current date if the only parameter entered is `siku`. Returns a formatted date and time if `kitu` matches the formatting strings.
