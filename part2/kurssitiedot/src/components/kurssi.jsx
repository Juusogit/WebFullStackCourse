const Part = (props) => {
    console.log('props value is', props)
    return (
      <p>
        {props.name} {props.exercises}
      </p>
    );
  };
  
  const Content = (props) => {
    console.log('props value is', props)
  
    return (
      <div>
        {props.parts.map((part) => (
          <Part key={part.id} name={part.name} exercises={part.exercises} />
        ))}
        <p><strong>{props.total} exercises in total</strong></p>
      </div>
    );
  };
  
  const Header = (props) => {
    console.log('props value is', props)
    return <h1>{props.name}</h1>
  };
  
  const Course = (props) => {
    console.log('props value is', props)
  
    const total = props.course.parts.reduce((s, part) => s + part.exercises, 0)
    return (
      <div>
        <Header name={props.course.name} />
        <Content parts={props.course.parts} total = {total} />
      </div>
    )
  }

export default Course