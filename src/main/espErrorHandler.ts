
function espErrorHandler(error) {
  switch (error) {
    case 'unsupported command':
      console.error(
        "Error: Command unknown. Please check 'autoflash --help' for instructions on how to use this tool."
      );
      break;
    case 'no port found':
      console.error(
        "Error: Couldn't find a port to select. Please specify it manually using the --port flag"
      );
      break;
    default:
      console.error(`Error: ${error}`);
  }

  console.log('');
}

export {
  espErrorHandler
}