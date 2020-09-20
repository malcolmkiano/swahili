# Built-in functions

## I/O

- **andika(`kitu: any`[, ...vitu: any[]]): `SWNull`**<br/>
  Prints given arguments to the console.

```
  andika("Jambo Dunia") // => "Jambo Dunia"
```

- **soma(`swali: SWString`): `SWString`**<br/>
  Gets and returns user input as a string. Uses the value of `swali` as a prompt message

```
  wacha jina = soma()
  > "Wendo" // User Input
  andika(jina) // => "Wendo"
```

- **somaNambari(`swali: SWString`): `SWNumber`**<br/>
  Gets and returns user input as a number. Uses the value of `swali` as a prompt message

```
  wacha umri = somaNambari()
  > 22 // User Input
  andika(umri) // => 22
```

- **futa(): `SWNull`**<br/>
  Clears the console window

## Type methods

### Checking type

- **aina(`kitu: any`): `SWString`**<br/>
  Returns a string indicating the data type of `kitu`

```
  wacha x = [1,2,3]
  andika(aina(x)) // => "Orodha"
```

- **niKamusi(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWObject`

```
  wacha mtu = {jina: "John", umri: 23}
  andika(niKamusi(mtu)) // => kweli
```

- **niTarehe(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWDateTime`

```
  wacha leo = Tarehe()
  andika(niTarehe(leo)) // => kweli
```

- **niTupu(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is `SWNull`

```
  wacha bure = tupu
  andika(niTupu(bure)) // => kweli
```

- **niNambari(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWNumber`

```
  wacha pi = 3.141592
  andika(niNambari(pi)) // => kweli
```

- **niJina(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWString`

```
  wacha neno="Wamlambez"
  andika(niJina(neno)) // => kweli
```

- **niOrodha(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWList`

```
  wacha list = [1,2,3,4]
  andika(niOrodha(list)) // => kweli
```

- **niShughuli(`kitu: any`): `SWBoolean`**<br/>
  Returns `kweli` if `kitu` is of type `SWBaseFunction`

```
  shughuli salimu(jina){
    andika("Habari" + jina)
  }
  andika(niShughuli(salimu)) // =>kweli
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

#### Iterables

- _iterable_.**idadi(): `SWNumber`**<br/>
  Returns the length of a list or string

```
  wacha list = [1,2,3,4]
  andika(list.idadi()) // => 4

  wacha str = "Something"
  andika(str.idadi()) // => 9
```

- _iterable_.**ina(`kitafuto: any`): `SWBoolean`**<br/>
  Returns a boolean indicating whether a string/list contains the element `kitu` or not.

```
  wacha list = [1,2,3,4]
  andika(list.ina(3)) // => kweli

  wacha str = "Something"
  andika(str.ina("x")) // => uwongo
```

- _iterable_.**pahala(`kitafuto: any`): `SWNumber`**<br/>
  Returns an SWNumber indicating the position of `kitafuto` in the iterable, or a `-1` if it does not exist.

```
  wacha list = [1,2,3,4]
  andika(list.pahala(3)) // => 2

  wacha str = "Something"
  andika(str.pahala("x")) // => -1
```

- _iterable_.**sehemu(`mwanzo: SWNumber[, mwisho: SWNumber]`): `iterable`**<br/>
  Returns a section of the string/list delimited by `mwanzo` and `mwisho`

```
  wacha list = [1,2,3,4]
  andika(list.sehemu(1,2)) // => [2,3]

  wacha str = "Something"
  andika(str.sehemu(-3)) // => "ing"
```

#### Strings

- _str_.**badili(`kitafuto: SWString | SWRegEx , mbadala: SWString`): `SWString`**<br/>
  Returns a new `SWString` made by replacing the string that matches `kitafuto` with the value provided for `mbadala`.

```
  wacha str = "Something"
  andika(str.badili("thing", "body")) // => "Somebody"
```

- _str_.**tenga(`kitengo: SWString | SWRegEx`): `SWList`**<br/>
  Returns an `SWList` made by splitting `str`, delimited by the value of `kitengo`

```
  wacha str = "Everybody-was-kungfu-fighting"
  andika(str.tenga("-")) // => ["Everybody", "was", "kungfu", "fighting"]
```

- _str_.**herufiKubwa(): `SWString`**<br/>
  Returns the uppercase equivalent of an `SWString`

```
  wacha str = "abcde"
  andika(str.herufiKubwa()) // => "ABCDE"
```

- _str_.**herufiNdogo(): `SWString`**<br/>
  Returns the lowercase equivalent of an `SWString`

```
  wacha str = "FGHIJ"
  andika(str.herufiNdogo()) // => "fghij"
```

#### Lists

- _list_.**weka(`pahala: SWNumber, kitu: any`): `SWList`**<br/>
  Modifies an `SWList` in place by replacing the value at `pahala` with the value provided for `kitu`. Returns the value of the list

```
  wacha list = [1,2,3,4]
  list.weka(0, 5)
  andika(list) // => [5,2,3,4]
```

- _list_.**fanya(`shug: SWFunction`): `SWList`**<br/>
  Maps each element in a list to a new value using the function provided for `shug`. The function `shug` receives two arguments: `el` (the current element) and `idx` (the current index). Returns the value of the new list

```
  wacha list = [1,2,3,4]
  shughuli multByIndex(el, idx) {
    rudisha el * idx
  }

  andika(list.fanya(double)) // => [0,2,6,12]
```

- _list_.**unga(`kiungo: SWString`): `SWString`**<br/>
  Returns a new SWString from the list, joined with the delimiter provided for `kiungo`.

```
  wacha list = [1,2,3,4]
  andika(list.unga("-")) // => "1-2-3-4"
```

- _list_.**kubwa(): `SWNumber`**<br/>
  Returns the largest element in a list of numbers(`SWNumber`).

```
  wacha list = [1,2,3,4]
  andika(list.kubwa()) // => 4
```

- _list_.**ndogo(): `SWNumber`**<br/>
  Returns the smallest element in a list of numbers(`SWNumber`).

```
  wacha list = [1,2,3,4]
  andika(list.ndogo()) // => 1
```

- _list_.**panga(): `SWList`**</br>
  Sorts a list in place and returns the sorted list.

```
  wacha list = [5,4,3]
  andika(list.panga()) // => [3,4,5]
```

#### Dates

- _date_.**unda(`muundo: SWString`): `SWString`**<br/>
  Formats a SWDateTime value as a SWString

```
  wacha date = Tarehe("01/01/2001")
  andika(date.unda("s, M t, MK")) // => "Jumatatu, Januari 01, 2001"
```

#### Objects

- _obj_.**viingilio(): `SWList`**<br/>
  Returns a list containing the key-value pairs of an object as tuples. This allows you to iterate through the properties of an object

```
  wacha obj = { jina: "John", umri: 23 }
  andika(obj.viingilio()) // => [["jina", "John"], ["umri", 23]]
```

## Async (Timeouts)

- **subiri(`shug: SWFunction[, muda: SWNumber[, arg1, arg2, ...]]`): `SWTimeout`**<br/>
  Sets a timer which executes a function once the timer expires. `muda` represents the delay in ms. Additional arguments (`arg1, arg2, ...`) get passed through to the function specified by `shug`.

  If `muda` is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, the next event cycle. Note that in either case, the actual delay may be longer than intended.

  A timeout can be cancelled using the `komesha()` method.

```
  shughuli ngojaWatu(a, b) {
    // hoja "a" na "b" hazihitajiki
    andika(a, "na", b, "wamefika.")
  }

  wacha s = subiri(ngojaWatu, 1000, "John", "Stella")
```

- **rudia(`shug: SWFunction, muda: SWNumber[, arg1, arg2, ...]`): `SWTimeout`**<br/>
  Repeatedly calls a function with a fixed time delay between each call. It returns an `SWTimeout` that uniquely identifies it, so you can remove it later by calling `komesha()`. `muda` must be at least **`1ms`** to allow code to actually run.

  > Ensure that execution duration is shorter than interval frequency

  If there is a possibility that your logic could take longer to execute than the interval time, it is recommended that you recursively call a named function using `subiri()`.

```
  shughuli semaSaa() {
    wacha t = Tarehe()
    andika(t.unda("sa:d w"))
  }

  wacha r = rudia(semaSaa, 1000)
```

- **komesha(`muda: SWTimeout`): `SWNull`**<br/>
  Cancels a timeout created by `subiri()` or `rudia()`

```
  shughuli semaSaa() {
    wacha t = Tarehe()
    andika(t.unda("sa:d w"))
  }

  wacha r = rudia(semaSaa, 1000)

  wacha s = subiri(shughuli () {
    komesha(r) // stops printing the time after 5 seconds
  }, 5000)
```
