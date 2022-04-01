function Tweet(props) {
  return (
    <div>
      <h3>username: {props.username}</h3>
      <h3>name: {props.name}</h3>
      <p><b><i>date</i></b>: <i>{props.date}</i></p>
      <p><b>message</b>: {props.message}</p>
    </div>    
  );
}