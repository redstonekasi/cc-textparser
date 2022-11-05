// i rarely write ts so if i can improve this in any way feel free to tell me

type ApplyWithArgument<Stores extends any[]> = (argument: string, index: number, ...stores: Stores) => string | void;
type ApplyWithoutArgument<Stores extends any[]> = (index: number, ...stores: Stores) => string | void;

interface Command<Stores extends any[]> {
  withArg?: ApplyWithArgument<Stores>;
  withoutArg?: ApplyWithoutArgument<Stores>;
};

interface Commands<Stores extends any[]> {
  [index: string]: Command<Stores>
};

/**
 * Parses text and executes any commands that have been registered.
 * @template Stores Any stores you want to be available in command functions
 */
export class TextParser<Stores extends any[]> {
  commands: Commands<Stores> = {};

  /**
   * Registers a new command
   * @example <caption>Example of registering a command that makes the passed argument upper case</caption>
   * this.registerCommand("u", true, (arg, index) => arg.toUpperCase());
   * this.parse("Hello \\u[world]!"); // returns "Hello WORLD!"
   * @param command The char used to execute this command
   * @param hasArgument Whether or not the command should be passed an argument
   * @param apply Function that is called when the command is executed
   */
  registerCommand(command: string, hasArgument: true, apply: ApplyWithArgument<Stores>): void;
  registerCommand(command: string, hasArgument: false, apply: ApplyWithoutArgument<Stores>): void;
  registerCommand(command: string, hasArgument: boolean, apply: ApplyWithArgument<Stores> | ApplyWithoutArgument<Stores>): void {
    if (this.commands[command]?.[hasArgument ? "withArg" : "withoutArg"])
      throw Error(`Command for key "${command}" is already assigned`);

    this.commands[command] ??= {};
    if (hasArgument)
      this.commands[command].withArg = apply as ApplyWithArgument<Stores>;
    else
      this.commands[command].withoutArg = apply as ApplyWithoutArgument<Stores>;
  }

  /**
   * Parses text
   * @param input The text that should be parsed
   * @param stores Any stores that have been defined as a class generic
   * @returns The parsed text
   */
  parse(input: string, ...stores: Stores) {
    let result = "";
    let pos = 0;
  
    while (pos !== input.length) {
      let skip = input.indexOf("\\", pos);
      if (skip === -1) break;

      result += input.substring(pos, skip);
      pos = skip + 1;

      let char = input[skip + 1]
      let command = this.commands[char];

      if (command) {
        let replacement: string | void;

        let start = input.indexOf("[", skip);

        if (start === skip + 2 && command.withArg) {
          let end = input.indexOf("]", start);

          const offset = input.substring(start, end).split("[").length - 2;
          for (let i = 0; i < offset; i++) {
            end = input.indexOf("]", end + 1);
          }

          if (end === -1) {
            // result += input[skip];
            // this is actually just supposed to be a warning
            throw Error(`Invalid argument format for command "${char}"`);
          }

          let argument = input.substring(start + 1, end);
          pos = end + 1;
          replacement = command.withArg(argument, result.length, ...stores);
        } else if (command.withoutArg) {
          pos += 1;
          replacement = command.withoutArg(result.length, ...stores);
        } else {
          // this should only be triggered if a command can only be executed
          // with an argument but doesn't get passed one
          throw new Error(`Expected an argument for command "${char}"`);
        }
  
        if (replacement) {
          result += this.parse(replacement, ...stores);
        }
      } else {
        result += input.charAt(skip);
      }
    }
  
    return result + input.substring(pos);
  }
}
