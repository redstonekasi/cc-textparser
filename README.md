## cc-textparser

A reimplementation of CrossCode's text parser.

# Usage
```
pnpm i cc-textparser
```

```js
import { TextParser } from "cc-textparser";

const parser = new TextParser();
parser.registerCommand("u", true, (text) => text.toUpperCase());

parser.parse("Hello \\u[world]!");
// => "Hello WORLD!"
```

See more examples in [examples/](/tree/main/examples)
