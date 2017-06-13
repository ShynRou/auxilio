# form configuration

The form configuration for commands

``` javascript

{
  title: string,
  control: {
    
  },
  elements: [
    {
      type: any | string | number | boolean | date | spacer | button | switch,
      ?id: string,
      ?x: number = 0,
      ?y: number = index,
      ?width: number = 12,
      ?height: number = 1,
      ?rules: {
        ?patern: regex,
        ?min: number,
        ?max: number,
      },
      ?required: boolean = false,
      
      ?script: CommandScript, // onChange automaticly send to api
    }
  ]
}

```

 > [CommandScript](../officer/command-script.md)