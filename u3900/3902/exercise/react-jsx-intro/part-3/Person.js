function Person(props) {
  return (
    <div>
      <p>Learn some information about this person.</p>
      <h3>Name: {props.name.length > 8 ? `${props.name.slice(0,6)}..` : props.name}</h3>
      <h3>Age: {props.age}</h3>
      <h3>{ props.age > 18 ? "please go vote!" : "you must be 18 to vote"}</h3>
      <h3>Hobbies:</h3>
      <ul>
        { props.hobbies.map(h => <li>{h}</li>) }
      </ul>
    </div>
  );
}