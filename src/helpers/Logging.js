import { blue, blueBright, yellow, yellowBright, red, redBright, green, greenBright } from 'colorette'

class Logging {

    log = (args) => this.info(args);

    info = (args) => console.log(blue(`[${new Date().toLocaleString()}] [INFO]`), typeof args === 'string' ? blueBright(args) : args);

    success = (args) => console.log(green(`[${new Date().toLocaleString()}] [SUCCESS]`), typeof args === 'string' ? greenBright(args) : args);

    warning = (args) => console.log( yellow(`[${new Date().toLocaleString()}] [WARN]`), typeof args === 'string' ? yellowBright(args) : args,);

    error = (args) => console.log(red(`[${new Date().toLocaleString()}] [ERROR]`), typeof args === 'string' ? redBright(args) : args);
}

export default new Logging()