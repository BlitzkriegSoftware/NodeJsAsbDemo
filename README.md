# NodeJsAsbDemo

A demo of Azure ASB in Node

## Prerequisites

1. Create a ASB Queue
2. Install JEST + JSDOCS
3. Either:
   - Set Environment Variables
     | Environment Variable | Use |
     |:---|:---|
     | AsbDemoConnection | Connection String |
     | AsbDemoQueue | Name of Queue to use |
   - Put in valid values to `asbconfig.json`

# run the program

```powershell
node .\index.js -c  .\\asbconfig.json  -s  5  -r  0
```

Where all parameters are required:

| Flag   | Meaning                        |
| :----- | :----------------------------- |
| -c     | Path to ASB Config File        |
| -s {#} | Send # Messages                |
| -r {#} | Receive messages for # Minutes |

# Things to look at
