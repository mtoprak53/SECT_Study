
// #############################################

// step1.js -1
// ##########################

function cat (path) {
  const fs = require('fs');
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.log("ERROR:", err);
      process.kill(1);
    }
    console.log(data);
  });
}

cat("one.txt");


// #############################################

// step1.js -2
// ##########################

const argv = process.argv;
const path = argv[argv.length - 1];

function cat (path) {
  const fs = require('fs');
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.log("ERROR:", err);
      process.kill(1);
    }
    console.log(data);
  });
}

cat(path);


// #############################################

// step1.js -3
// ##########################

const argv = process.argv;
const path = argv[argv.length - 1];

function cat (path) {
  const fs = require('fs');
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading ${path}:\n\tError: ENOENT: no such file or directory, open \'${path}\'`);
      return   // to avoid 'undefined'
    }
    console.log(data);
  });
}

cat(path);


// #############################################

// step_2.js -1
// ##########################


const axios = require('axios');

const argv = process.argv;
const path = argv[argv.length - 1];

async function webCat (path) {
  // const fs = require('fs');
  const res = await axios.get(path);
  console.log(res.data);
}

webCat(path);


// #############################################

// step_2.js -2
// ##########################

const axios = require('axios');

const argv = process.argv;
const path = argv[argv.length - 1];

function cat (path) {
  const fs = require('fs');
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading ${path}:\n\tError: ENOENT: no such file or directory, open \'${path}\'`);
      return   // to avoid 'undefined'
    }
    console.log(data);
  });
}

function webCat (path) {
  axios.get(path)
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log("THERE IS AN ERROR, PAPITO:", err);
    });
}

function catOrWebCat(path) {
  // path IS AN URL, IF IT STARTS WITH 
  // "http://"  or  "https://"
  if (path.includes('http://', 0) || path.includes('https://', 0)) {
    webCat(path);
  } else {
    cat(path);
  }
}

catOrWebCat(path);


// #############################################

// step_3.js -1
// ##########################

const axios = require('axios');

let out, path, output;
const argv = process.argv;

// IF ARGV.LENGTH == 3 => catOrWebCat()
if (argv.length == 3) {
  out = false;
  path = argv[2];
  console.log("PATH  ==>>  ", path);
  console.log("WRITING ON CONSOLE");
} else if (argv.length == 5 && argv[2] == '--out') {

// ELSE IF ARGV.LENGTH == 5 && ARGV[2] == "--out"
  out = true;
  path = argv[3];
  output = argv[4];
  console.log("PATH  ==>>  ", path);
  console.log("WRITING IN FILE");
  console.log("OUTPUT FILE  ==>>  ", output);
} else {

// ELSE => ERROR
  console.log("ERROR: INVALID ARGUMENT NUMBER!\nPLEASE CHECK YOUR COMMAND!!");
  process.kill(0);
}


function cat (path, out=false, output=undefined) {
  const fs = require('fs');
  fs.readFile(path, 'utf8', (err, data) => {

    // ERROR CASE
    if (err) {
      console.log(`Error reading ${path}:\n\tError: ENOENT: no such file or directory, open \'${path}\'`);
      return   // to avoid 'undefined'

    // WRITE-TO-FILE CASE
    } else if (out) {
      fs.writeFile(output, data, 'utf8', err => {
        if (err !== null) {
          console.log(`Couldn't write ${output}:\n\tError: ENOENT: no such file or directory, open '${output}'`, err);
        }
      });
      console.log(`The content of '${path}' has been successfully written in '${output}'`);

    // WRITE-ON-CONSOLE CASE
    } else {
      console.log(data);
    }
  });
}

function webCat (path, out=false, output=undefined) {
  const fs = require('fs');
  axios.get(path)
    .then(res => {
      if (out) {
        fs.writeFile(output, res.data, 'utf8', err => {
          if (err !== null) {
            console.log(`Couldn't write ${output}:\n\tError: ENOENT: no such file or directory, open '${output}'`, err);
          }
        });
        console.log(`The content of '${path}' has been successfully written in '${output}'`);
      } else {
        console.log(res.data);
      }
    })
    .catch(err => {
      if (err.response.status) {
      console.log(`Error fetching ${path}:\n\tError: Request failed with status code ${err.response.status}`);
      } else {
        console.log("THERE IS AN ERROR, PAPITO:", err.response.status);
      }
    });
}

function catOrWebCat(path, out=false, output=undefined) {
  // path IS AN URL, IF IT STARTS WITH "http://" or "https://"
  if (path.includes('http://', 0) || path.includes('https://', 0)) {
    webCat(path, out, output);
  } else {
    cat(path, out, output);
  }
}


catOrWebCat(path, out, output);


// #############################################

// step_3.js -2
// ##########################

const axios = require('axios');

let out, path, output;
const argv = process.argv;

// IF ARGV.LENGTH == 3 => catOrWebCat()
if (argv.length == 3) {
  out = false;
  path = argv[2];
  console.log("PATH  ==>>  ", path);
  console.log("WRITING ON CONSOLE");
} else if (argv.length == 5 && argv[2] == '--out') {

// ELSE IF ARGV.LENGTH == 5 && ARGV[2] == "--out"
  out = true;
  path = argv[3];
  output = argv[4];
  console.log("PATH  ==>>  ", path);
  console.log("WRITING IN FILE");
  console.log("OUTPUT FILE  ==>>  ", output);
} else {

// ELSE => ERROR
  console.log("ERROR: INVALID ARGUMENT NUMBER!\nPLEASE CHECK YOUR COMMAND!!");
  process.kill(0);
}


function err_func(err) {
  if (err !== null) {
    console.log(`Couldn't write ${output}:\n\tError: ENOENT: no such file or directory, open '${output}'`, err);
  }
}

function writeIt(path, out, output, data) {
  const fs = require('fs');

  // WRITE-TO-FILE CASE
  if (out) {
    fs.writeFile(output, data, 'utf8', err => err_func(err));
    console.log(`The content of '${path}' has been successfully written in '${output}'`);

  // WRITE-ON-CONSOLE CASE
  } else {
    console.log(data);
  }
}

function cat (path, out=false, output=undefined) {
  const fs = require('fs');
  fs.readFile(path, 'utf8', (err, data) => {

    // ERROR CASE
    if (err) {
      err_func(err);
      return   // to avoid 'undefined'
    }
    
    writeIt(path, out, output, data)
  });
}

function webCat (path, out=false, output=undefined) {
  axios.get(path)
    .then(res => writeIt(path, out, output, res.data))
    .catch(err => {
      if (err.response.status) {
        console.log(`Error fetching ${path}:\n\tError: Request failed with status code ${err.response.status}`);
      } else {
        console.log("THERE IS AN ERROR, PAPITO:", err.response.status);
      }
    });
}

function catOrWebCat(path, out=false, output=undefined) {
  // path IS AN URL, IF IT STARTS WITH 
  // "http://" or "https://"
  const http = path.includes('http://', 0);
  const https = path.includes('https://', 0);
  
  http || https ? webCat(path, out, output) : cat(path, out, output);
}


catOrWebCat(path, out, output);


// #############################################

// step_3.js -3 (further study)
// ##########################

const axios = require('axios');

let out, path, output, start;
const argv = process.argv;

// ERROR
if (argv.length < 3 || (argv.length < 4 && argv[2] == '--out')) {
    console.log("ERROR: INVALID ARGUMENT NUMBER!\nPLEASE CHECK YOUR COMMAND!!");
    process.kill(0);

// WRITE IN A FILE
} else if (argv[2] == '--out') {
  out = true;
  paths = argv.slice(3, argv.length - 1);
  output = argv[argv.length - 1];

  console.log("PATHs  ==>>  ", paths);
  console.log("OUTPUT FILE  ==>>  ", output);
  console.log("WRITING IN FILE\n");

// WRITE ON CONSOLE
} else {
  out = false;
  paths = argv.slice(2);

  console.log("PATHs  ==>>  ", paths);
  console.log("WRITING ON CONSOLE\n");
}


function err_func(err) {
  if (err !== null) {
    console.log(`Couldn't write ${output}:\n\tError: ENOENT: no such file or directory, open '${output}'`, err);
  }
}

function writeIt(path, out, output, data) {
  const fs = require('fs');

  // WRITE-TO-FILE CASE
  if (out) {
    fs.appendFile(output, data, 'utf8', err => err_func(err));
    console.log(`The content of '${path}' has been successfully written in '${output}'`);

  // WRITE-ON-CONSOLE CASE
  } else {
    console.log(data);
  }
}

function writtenThing(path, res) {
  return `${path} (The first 1000 characters)\n -------------------- \n ${res.data.slice(0, 1000)} + \n\n\n`
}

function cat (path, out=false, output=undefined) {
  const fs = require('fs');
  fs.readFile(path, 'utf8', (err, data) => {

    // ERROR CASE
    if (err) {
      err_func(err);
      return   // to avoid 'undefined'
    }
    
    writeIt(path, out, output, data)
  });
}

function webCat (path, out=false, output=undefined) {
  axios.get(path)
    .then(res => writeIt(path, out, output, writtenThing(path, res)))
    .catch(err => {
      if (err.response.status) {
        console.log(`Error fetching ${path}:\n\tError: Request failed with status code ${err.response.status}`);
      } else {
        console.log("THERE IS AN ERROR, PAPITO:", err.response.status);
      }
    });
}

function catOrWebCat(paths, out=false, output=undefined) {
  for (let path of paths) {
    // path IS AN URL, IF IT STARTS WITH 
    // "http://" or "https://"
    const http = path.includes('http://', 0);
    const https = path.includes('https://', 0);
    http || https ? webCat(path, out, output) : cat(path, out, output);
  }
}


catOrWebCat(paths, out, output);


// #############################################
