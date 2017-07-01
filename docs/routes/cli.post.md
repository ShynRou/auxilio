# /api/cli [POST]

Accepts a script call as payload.


returns: 

```javascript
{
  type: 'success' | 'failure' | 'step',
  
  // 'success' | 'failure'  
  text: string,
  speech: string,
  data: any,
  
  // 'step'
  form: FormObject,
}
```
 > [FormObject](../plugins/form.md)

 