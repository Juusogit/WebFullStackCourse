import Course from './components/kurssi'

const App = () => {
  const courses = [
    {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
          ]
    },
    {
    name: 'Valtterin salitreenien liikemäärät',
    id: 2,
    parts: [
      {
        name: 'penkkipäivä',
        exercises: 8,
        id:1
      },
      {
        name: 'selkäpäivä',
        exercises: 3,
        id:2
      },
      {
        name: 'jalkapäivä',
        exercises: 2,
        id: 4
      },
          ],
    },
]

  return (
    <div>
      {courses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  );
};

export default App