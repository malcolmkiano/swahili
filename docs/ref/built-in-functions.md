# Built-in functions

## I/O

- **andika(`ujumbe: SWString`): `SWNull`**<br/>
  Prints `ujumbe` to the console.
  For Example:

```
  andika("Jambo Dunia")
  >> "Jambo Dunia"
```

- **soma(`swali: SWString`): `SWString`**<br/>
  Gets and returns user input as a string. Uses the value of `swali` as a prompt message
  For example:

```
  wacha jina = soma()
  > "Wendo" // User Input
  andika(jina)
  >> "Wendo"
```

- **somaNambari(`swali: SWString`): `SWNumber`**<br/>
  Gets and returns user input as a number. Uses the value of `swali` as a prompt message

```
  wacha umri = somaNambari()
  > 22 // User Input
  andika(umri)
  >> 22
```

- **futa(): `SWNull`**<br/>
  Clears the console window

## Type methods

### Checking type

- **aina(`kitu: any`): `SWString`**<br/>
  Returns a string indicating the data type of `kitu`

```
  wacha x = [1,2,3]
  andika(aina(x))
  >> "Orodha"
```

- **niKamusi(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWObject`

```
  wacha mtu = {jina: "Kiano", umri: 23}
  andika(niKamusi(mtu))
  >> kweli
```

- **niTarehe(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWDateTime`

```
  wacha leo = Tarehe()
  andika(niTarehe(leo))
  >> kweli
```

- **niTupu(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is `SWNull`

```
  wacha bure = tupu
  andika(niTupu(bure))
  >> kweli
```

- **niNambari(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWNumber`

```
  wacha pi = 3.141592
  andika(niNambari(pi))
  >> kweli
```

- **niJina(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWString`

```
  wacha neno="Wamlambez"
  andika(niJina(neno))
  >> kweli
```

- **niOrodha(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWList`

```
  wacha list = [1,2,3,4]
  andika(niOrodha(list))
  >> kweli
```

- **niShughuli(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWBaseFunction`

```
  shughuli salimu(jina){
    andika("Habari" + jina)
  }
  andika(niShughuli(salimu))
  >> kweli
```

### Type casting

- **Nambari(`kitu: SWString | SWBoolean | SWNumber`): `SWNumber`**<br/>
  Returns an `SWNumber` representation of the value passed in

- **Jina(`kitu: any`): `SWString`**<br/>
  Returns an `SWString` representation of the value passed in

- **Tarehe(`siku: SWDateTime | SWString`): `SWDateTime`**<br/>
  Returns the current date, or a date with the value matching the parameter `siku`.
  For info on `SWDateTime` formatting, read [the guide](../guide/07-numbers-and-dates)

- **RegEx(`muundo: SWString, bendera: SWString`): `SWRegEx`**<br/>
  Returns `SWRegEx` representation of the value passed in

### Modification and reading (see also [Grammar and Types](../guide/02-grammar-and-types.md))

#### Iterable Modifiers

- **idadi(`kitu: SWList | SWString`): `SWNumber`**<br/>
  Returns the length of a list or string

- **ina(`kitu: SWString | SWList, kitafuto: SWList`): `SWBoolean`**<br/>
  Returns a boolean indicating whether a string/list contains the element `kitu` or not.

- **sehemu(`kitu: SWString | SWList, mwanzo: SWNumber, mwisho: SWNumber`): `SWString | SWList`**<br/>
  Returns a section of the string/list delimited by `mwanzo` and `mwisho`

#### String Modifiers

- **badili(`jina: SWString, kitafuto: SWString | SWRegEx , mbadala: SWString`): `any`**<br/>
  Modifies an `SWString` in place by replacing the string that matches `kitafuto` with the value provided for `mbadala`. Returns the new value of `jina`

- **tenga(`jina: SWString, kitengo: SWString`): `SWList`**<br/>
  Converts an `SWString` to an `SWList` by splitting each section delimited by the value of `kitengo`

- **herufiKubwa(`jina: SWString`): `SWString`**<br/>
  Modifies an `SWString` to Upercase

- **herufiNdogo(`jina: SWString`): `SWString`**<br/>
  Modifies an `SWString` to Lowercase

#### List Modifers & Reading

- **unga(`orodha: SWList, kiungo: SWString`):`SWString`**<br/>
  Returns a string from the list `orodha`, with the delimiter provided in `kiungo`.

- **weka(`orodha: SWList, pahala: SWNumber, kitu: any`): `SWList`**<br/>
  Modifies an `SWList` in place by replacing the value at `pahala` with the value provided for `kitu`. Returns the new value of `orodha`

- **kubwa(`orodha:SWList`): `any`**<br/>
  Returns the largest element in a list `orodha` of numbers(`SWNumber`).

- **ndogo(`orodha:SWList`): `any`**<br/>
  Returns the smallest element in a list `orodha` of numbers(`SWNumber`).

#### Date modifers

- **unda(`tarehe: SWDateTime, muundo: SWString`): `SWString`**<br/>
  Formats a `tarehe` SWDateTime value as a SWString
