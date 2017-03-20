import React from 'react';
import {Form, FormGroup, Col, Button, FormControl} from 'react-bootstrap';


export default class WriteDrill extends React.Component {
  constructor (props) {
    super (props);

  }

  displayAnswers(correctAnswers) {

   const tablestyle = {
     padding: '10px'
   };

   return(
     <div>
       { (this.props.isCorrect === true) ?
         <h1>Correct!</h1>
         :
         <h1>Incorrect!</h1>
       }

       <h5>Correct Answers:</h5>
       <table>
         <tbody>
       { correctAnswers.map((answer, i) =>
         <tr key={i} >
           <td style={tablestyle}> {answer.body} </td>
           <hr />
         </tr>
       )}
       </tbody>
     </table>
     </div>
    )
  }


  render (){

    let answerInput = <div></div>;
    if (this.props.correctAnswers.length > 0){
      answerInput = (
        <Form horizontal onSubmit={this.props.onSubmit}>
          <FormGroup controlId="formHorizontalAnswer">
            <Col sm={10}>
              <FormControl type="text" name="answer"
                placeholder="Your Answer"/>
            </Col>
          </FormGroup>
          <Button type="submit" disabled>
            Submit
          </Button>
        </Form>
        )
    } else {
      answerInput = (
        <Form horizontal id={this.props.drills[this.props.index].id} onSubmit={this.props.onSubmit}>

          <FormGroup controlId="formHorizontalAnswer">
            <Col sm={10}>
              <FormControl type="text" name="answer"
                placeholder="Your Answer"/>
              </Col>
            </FormGroup>
            <Button type="submit">
              Submit
            </Button>
        </Form>
        )
    }



    return <block>
      <h1>Drill Group: {this.props.drillGroup.name}</h1>
      <p>Drill: {this.props.drills[this.props.index].exercise}</p>
      <h3>Answer</h3>
      {answerInput}
      { (this.props.correctAnswers.length > 0) ? this.displayAnswers(this.props.correctAnswers) : ''}
      {/* ternary works instead of if/else in JSX. */}
       <Button bsSize="large" onClick={this.props.onNext}>Next Drill</Button>

    </block>
  }
}
