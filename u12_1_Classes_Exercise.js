
// ------------
// OO CHALLENGE
// ------------

// PART-1
class Vehicle {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
  honk() {
    return "Beep.";
  }
  toString() {
    return `The vehicle is a ${this.make} ${this.model} from ${this.year}.`
  }
}

// PART-2
class Car extends Vehicle {
  constructor(make, model, year) {
    super(make, model, year);
    this.numWheels = 4;
  }
}

// PART-3
class Motorcycle extends Vehicle {
  constructor(make, model, year) {
    super(make, model, year);
    this.numWheels = 2;
  }
  revEngine() {
    return "VROOM!!!";
  }
}

// PART-4
class Garage {
  constructor(capacity) {
    this.capacity = capacity;
    this.vehicles = [];
  }
  add(car) {
    if(!(car instanceof Vehicle)) {
      console.log("Only vehicles are allowed here!");
    } else if (this.vehicles.length === this.capacity) {
      console.log("Sorry, we're full.");
    } else {
      this.vehicles.push(car);
      console.log("Vehicle added!");
    }
  }
}