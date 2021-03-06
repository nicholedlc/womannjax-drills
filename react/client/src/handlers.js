const BASE_URL = 'http://localhost:3000';

// sendFetch('/drill-groups','GET',{},{ token: this.state.user.token })
// sendFetch('/drill-groups','POST',{some: data, other: stuff},{ token: this.state.user.token })
function sendFetch (path, method, body, user = {}){
  let req = {
    headers: {
      'user': JSON.stringify(user)
    }
  }
  if (method.toLowerCase() != 'get'){
    Object.assign(req, {
      credentials: 'include',
      method: `${method}`,
      mode: 'cors',
      body: JSON.stringify(body)
    });
    Object.assign(req.headers,{
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }
  return fetch(`${BASE_URL}${path}`,req)
  .then(r=>{
    if(r.status === 400 || r.status === 401) {
      return null;
    }
    return r.json();
  })
}

class Handlers {

  addNewDrill (event) {
    event.preventDefault();
    const {target} = event;
    const description = target.querySelector('#new-drill-description').value;
    target.querySelector('#new-drill-description').value = "";
    const points = target.querySelector('#drill-points').value;

    target.querySelector('#drill-points').value = "";
    const drillGroupId = target.id;
    // console.log(description,points,drillGroupId);

    let solutionsArr = [];
    target.querySelector('#new-drill-solution')
        .querySelectorAll('textarea')
        .forEach(solution=>{
          solutionsArr.push({body: solution.value})
          solution.value = "";
        });

        // console.dir(solutionsArr);
    return sendFetch(
      `/drill-groups/${drillGroupId}/drills`,
      'POST',
      {
        exercise:`${description}`,
        points: `${points}`,
        solutions: solutionsArr
      },
      {token: this.state.user.token}
    )
    .then((json)=>{

      console.log("here");
      this.setState(Object.assign(
        {},
        this.state,
        {
          drillGroup: Object.assign(
              {},
              this.state.drillGroup,
              {
                drills:this.state.drillGroup.drills.concat(json)
              }
            )
        }));


    })
    .catch(console.error)
  }

  onDrillGroupView (event) {
    event.preventDefault();
    // console.dir(event.target);
    const {target} = event;
    const drillGroupId = target.parentNode.parentNode.parentNode.parentNode.id;

    sendFetch(
      `/drill-groups/${drillGroupId}`,
      'GET',
      {},
      {token: this.state.user.token}
    )
    .then((json)=>{
      console.log(json)
      this.setState(Object.assign({},
                  this.state,
                  {
                    path: `/admin/drill_group/${json.id}`,
                    drillGroup: json
                  }))
    })
    .catch(console.error)
  }

  handleLeaderBoard(event){
    event.preventDefault();
    sendFetch('/usersboard','GET',{},{token: this.state.user.token})
      .then(users=>{
        this.setState(Object.assign(
          {},
          this.state,
          {
            path: '/leaderboard',
            users: users
          }
        ))
      })
  }


  updateDrillGroup (event) {
    event.preventDefault();
    const {target} = event;
    const name = target.querySelector('#drill-group-name').value;
    const description = target.querySelector('#drill-group-description').value;
    let level = ""; target.querySelectorAll('input[name="level"]')
      .forEach(radio=>{
        if (radio.checked){
          level = radio.value;
        }
      });

    sendFetch('/drill-groups/:id',
              'PUT',{
                drillGroup: {
                name: `${name}`,
                description:`${description}`,
                level: `${level}`
                }
              },
          {
            token: this.state.user.token
          })
    .then((json)=>{
      console.log("here",json)
    })
    .catch(console.error)
  }

  createNewDrillGroup (event) {
    event.preventDefault();
    const {target} = event;
    const name = target.querySelector('#drill-group-name').value;
    const description = target.querySelector('#drill-group-description').value;
    let level = ""; target.querySelectorAll('input[name="level"]')
      .forEach(radio=>{
        if (radio.checked){
          level = radio.value;
        }
      });

    sendFetch('/drill-groups','POST',{
          name: `${name}`,
          description:`${description}`,
          level: `${level}`
        },{
          token: this.state.user.token
        })
    .then((json)=>{
      this.setState(Object.assign({},this.state,{ path: `/admin/drill_group/${json.id}`, drillGroup: json }));
    })
    .catch(console.error)
  }

  signIn  (event) {
    event.preventDefault();
    const {target} = event;
    const email = target.querySelector('#formHorizontalEmail').value;
    const password = target.querySelector('#formHorizontalPassword').value;
    sendFetch('/sessions','POST',{username: `${email}`,password:`${password}`})
    .then((json)=>{
      let path = '/sessions/new'
      if (json){
        if(json.is_admin){
          path = '/admin/get-drill-groups';
        } else if(json.token){
          path = '/users/get-drill-groups';
        } else {
          path = '/account-pending'
        }
      } else {
        alert('Username and/or Password do not match');
      }
        this.setState(Object.assign(
                          {},
                          this.state,
                          { path: path, user: json || {}}
          )
        );
    })
    .then(console.log(this.state))
    .catch(console.error)
  }

  getMyAllDrills () {
    sendFetch(`/my-drills/drill-groups`,'GET',{},{token: this.state.user.token })
    .then(json=>{
      let t = this.state.t || 0;
      this.setState(Object.assign(
                        {},
                        this.state,
                        {
                          path: `/users/${this.state.user.id}/drill_groups`,
                          myDrillGroups: json.myDrillGroups,
                          allDrillGroups: json.allDrillGroups,
                          t: t + 1
                        }));
    })
  }

  signUp  (event) {
    event.preventDefault();
    const {target} = event;
    const firstName = target.querySelector('#formHorizontalFirstName').value;
    const lastName = target.querySelector('#formHorizontalLastName').value;
    const email = target.querySelector('#formHorizontalEmail').value;
    const password = target.querySelector('#formHorizontalPassword').value;
    const passwordConfirmation = target.querySelector('#formHorizontalPasswordConfirmation').value;
    sendFetch('/users','POST',{
      first_name: `${firstName}`,
      last_name: `${lastName}`,
      email: `${email}`,
      password:`${password}`,
      passwordConfirmation:`${passwordConfirmation}`
    })
    .then((json)=>{
      console.log(json);
      this.setState({ path: json.path, user: json.user, errors: json.errors })
    })
    .catch(console.error)
  }

  startDrill (event){
    event.preventDefault();
    const {currentTarget, target} = event;

    const drillGroupId = currentTarget.parentNode.parentNode.parentNode.id;
    const myDrillId = currentTarget.parentNode.parentNode.parentNode.getAttribute('data-id');
    console.log(drillGroupId,myDrillId);
    const attempts = currentTarget.parentNode.parentNode.parentNode.getAttribute('data-attempts');
    sendFetch(`/drill-groups/${drillGroupId}`, 'GET', {}, {token:this.state.user.token})
    .then((json)=>{
      console.log('This is what we got ',json)
      this.setState(Object.assign(
        {},
        this.state,
        {
          path: '/drill_baby_drill',
          drillGroup: json,
          index: 0,
          correctAnswers: [],
          score: 0,
          myDrillId: myDrillId,
          attempts: attempts
        }
      ))
    })
  }

  deleteDrill (event) {
    event.preventDefault();
    // window.alert("You've successfully called the handler") Fuck yes i did
    const {target} = event;
    const drillNode = target.parentNode.parentNode.parentNode.parentNode
    const drillId = drillNode.id;
    sendFetch(
      `/drills/${drillId}`,
      'DELETE',
      {},
      {token: this.state.user.token}
    )
    .then((json)=>{
      function isNotDeleted(drill){
          // console.log(drill.id)
          // console.log(drillId)
        return drill.id!=drillId
      }
      let newDrillGroups = this.state.drillGroup.drills.filter(isNotDeleted);


    })
    .catch(console.error)
    // drillNode.parentNode.style.visibility='hidden';

  }

  deleteDrillGroup (event) {
    event.preventDefault();
    const {target} = event;
    const drillgroupDiv = target.parentNode.parentNode.parentNode.parentNode
    const drillGroupId = drillgroupDiv.id
    sendFetch(`/drill-groups/${drillGroupId}`, 'DELETE', {}, {token:this.state.user.token})
    .then((json)=>{
      // console.log(this.state.drillGroups);
      //
      // function isNotDeleted(object){
      //   console.log(object.id)
      //   console.log(drillGroupId)
      //   return object.id!=drillGroupId
      // };
      // let newdrillGroups = this.state.drillGroups.filter(isNotDeleted);
      this.setState(Object.assign(
        {},
        this.state,
        { path: '/admin/get-drill-groups' }
      ));


    })
    // drillgroupDiv.style.visibility='hidden';

  }

  verifyUser(event) {
    event.preventDefault();
    const {target} = event;
    const userId = target.getAttribute('data-id');
    sendFetch(`/admin/users/${userId}`,'POST',{},{token:this.state.user.token})
    .then(()=>{
      this.getVerifyUsers(event);
    })
  }

  getVerifyUsers (event) {
    event.preventDefault();
    sendFetch('/admin/users','GET',{},{token: this.state.user.token})
    .then(json=>{
      console.log(json)
      this.setState(Object.assign({},this.state,{path: '/admin/users',
      users: json
      }))
    })
  }

  submitAnswer (event) {
    event.preventDefault();
    const {target} = event;
    const userAnswer = target.querySelector('#formHorizontalAnswer').value;
    target.querySelector('#formHorizontalAnswer').value = "";
    const drillId = target.id;
    sendFetch(`/drills/${drillId}`,'POST',{
      userAnswer: userAnswer
    },{
      token: this.state.user.token
    })
    .then(json=>{
      let points = 0;
      if (json.isCorrect) {
        points = json.points;
      }
      this.setState(Object.assign(
        {},
        this.state,
        {
          isCorrect: json.isCorrect,
          correctAnswers: json.correctAnswers,
          score: this.state.score + points
        }
      ))
    })
  }

  getAdminAllDrills () {
    sendFetch('/drill-groups','GET',{},{token: this.state.user.token})
    .then(json=>{
      console.log(json);
      this.setState(Object.assign({},this.state,{ path: `/admin/drill_board`, drillGroups: json }));
    })
  }

  goToAdminDrills(event){
    event.preventDefault();
    this.setState(Object.assign({},this.state, { path: '/admin/get-drill-groups'} ));
  }

  goToSignIn (event) {
    event.preventDefault();
    this.setState(Object.assign({},{ path: '/sessions/new', user: this.state.user, errors: [] }));
  }

  goToSignUp (event) {
    event.preventDefault();
    this.setState({ path: '/users/new', user: this.state.user, errors: [] });
  }

  goToProfile (event) {
    event.preventDefault();
    this.setState(Object.assign({},{ path: `/users/${this.state.user.id}`, user: this.state.user, errors: [] }));
  }

  goToForgotPassword (event) {
    event.preventDefault();
    this.setState(Object.assign({},{ path: `/reset_password/new`, user: this.state.user, errors: [] }));
  }
  goToLeaderboard (event) {
    event.preventDefault();
    this.setState(Object.assign({},{ path: `/leaderboard`, user: this.state.user, errors: [] }));
  }


  goToAdminCreateDrillGroup (event) {
    event.preventDefault();
    this.setState(Object.assign({},this.state,{ path: `/admin/drill_board/new` }));
  }

  logout (event) {
    event.preventDefault();
    this.setState(Object.assign({},{ path: '/', user: {}, errors: [] }))
    .then(json => console.log(json))
  }

  incrementIndex (event) {
    event.preventDefault();
    this.setState(Object.assign(
      {},
      this.state,
      {
        index: this.state.index + 1,
        correctAnswers: []
      }
    ))
  }

  finishDrillGroup (event) {
    event.preventDefault();
    sendFetch(`/my-drills/${this.state.myDrillId}`,'PUT',
          {
            attempts: parseInt(this.state.attempts) + 1,
            score: this.state.score
          })
          .then(json=>{
            this.setState(Object.assign(
              {},
              this.state,
            {
              path: '/users/get-drill-groups'
            }))
          })
  }

  addToMyDrills (event) {
    event.preventDefault();
    const {target} = event;
    const drillGroupId = target.parentNode.id;
    sendFetch(`/users/${this.state.user.id}/drill-groups/${drillGroupId}`,
      'post',
      {},
      {
        token: this.state.user.token
      })
      .then(()=>{
        this.setState(Object.assign({},this.state,{path:'/users/get-drill-groups'}))
      })

  }

  removeFromMyDrills (event) {
    event.preventDefault();
    const {target} = event;
    const drillGroupId = target.parentNode.id;
    sendFetch(`/my-drills/${this.state.user.id}/drill-groups/${drillGroupId}`,
      'put',
      {},
      {
        token: this.state.user.token
      })
    .then(()=>{
      this.setState(Object.assign({},this.state,{path:'/users/get-drill-groups'}))
    })
  }

}

module.exports = Handlers;
