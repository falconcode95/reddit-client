      import { useEffect, useState } from 'react';
      import './App.css';


      function App() {

        const [darkMode, setDarkMode] = useState(false);
        const [subreddit, setSubreddit] = useState();
        const [numberOfLikes, setNumberOfLikes] = useState();
        const [title, setTitle] = useState();
        const [timePosted, setTimePosted] = useState();
        const [content, setContent] = useState();
        const [numberOfComments, setNumberOfComments] = useState();
        const [postPermaLink, setPostPermaLink] = useState();
        const [comments, setComments] = useState({permalink: '', toggle: false, selectedCommentId: ''});
        const [commentAuthor, setCommentAuthor] = useState();
        const [commentTime, setCommentTime] = useState();
        const [commentText, setCommentText] = useState();
        const [commentUps, setCommentUps] = useState();
        const [loadingPhase, setLoadingPhase] = useState(false);
        const [deletePreviousComment, setDeletePriviousComment] = useState(true);
        const popularSubreddits = ['r/announcements','r/funny','r/AskReddit','r/gaming','r/aww','r/Music','r/pics','r/science','r/worldnews','r/videos'];
        const redditLogos = ['https://i.ibb.co/7YMQ5yJ/9.png', 'https://i.ibb.co/9252gDZ/8.png', 'https://i.ibb.co/ypfk4kp/7.png', 
                            'https://i.ibb.co/GPcLJt5/6.png', 'https://i.ibb.co/3NSZGBY/5.png', 'https://i.ibb.co/Mp4kM2b/4.png', 'https://i.ibb.co/thv4RgP/3.png', 
                            'https://i.ibb.co/Q6zTS29/2.png', 'https://i.ibb.co/yBMbwr3/image.png', 'https://i.ibb.co/5GHzYbq/1.png'];
        const [keySubreddit, setKeySubreddit] = useState('hot');
        const dataList = !postPermaLink ? [] : subreddit.map((subreddit,index) => 
                        [subreddit, numberOfLikes[index], title[index],timePosted[index],numberOfComments[index],content[index], postPermaLink[index]]);
        const commentData = !commentUps || deletePreviousComment ?  [] : commentAuthor.map((commentauthor,index) => 
                        [commentauthor, commentTime[index], commentText[index],commentUps[index]]);
         
        // console.log(`deletePreviousComment: ${deletePreviousComment} comments.toggle: ${comments.toggle} loadingPhase: ${loadingPhase}`);

        // console.log(dataList);
        // console.log(commentData);
        // console.log(content)
        // console.log(darkMode);
        // console.log(keySubreddit);
        

        useEffect(()=> { 
            let [sreddit, nOfLikes, author_, title_, timePosted_, nOfComments, content_, postPermaLink_] = [[],[],[],[],[],[],[],[]]; 

            const loadSubreddits = async () => {
try{              const url = 'https://www.reddit.com/'+keySubreddit+'/.json';
              const response = await fetch(url);
              // console.log(response)
              if(response.ok){              
              const jsonResponse = await response.json();
              // console.log(jsonResponse);
              for(let i=0;i < 20; i++){
                let ups = jsonResponse.data.children[i].data.ups
                let updatedUps = Math.floor(ups/100)/10;
                let numToString = updatedUps.toString();
                if(ups < 1000){
                  nOfLikes.push(ups);
                } else if(ups > 1000 && !numToString.includes('.')){
                  nOfLikes.push(`${updatedUps}.0k`);
                } else if(ups > 1000 && numToString.includes('.')){
                  nOfLikes.push(`${updatedUps}k`);
                }
                let ncomments = jsonResponse.data.children[i].data.num_comments;
                sreddit.push('r/' + jsonResponse.data.children[i].data.subreddit);
                author_.push(jsonResponse.data.children[i].data.author);
                title_.push(jsonResponse.data.children[i].data.title.replace('&amp;', '&').replace('&gt;', ''));
                if(ncomments === 1){
                  ncomments = 0;
                }
                nOfComments.push(ncomments > 1000 ? `${Math.floor(ncomments/100)/10}k Comments` :  `${ncomments} Comments`);
                if(jsonResponse.data.children[i].data.media && jsonResponse.data.children[i].data.media.reddit_video){
                  content_.push({video: jsonResponse.data.children[i].data.media.reddit_video.fallback_url})
                } else if(jsonResponse.data.children[i].data.post_hint === 'image'){
                  content_.push({image: jsonResponse.data.children[i].data.url_overridden_by_dest})
                } 
                else if((!jsonResponse.data.children[i].data.domain.includes('redd') 
                && !jsonResponse.data.children[i].data.domain.includes('self')) || jsonResponse.data.children[i].data.url.includes('gallery')
                || jsonResponse.data.children[i].data.selftext) { 
                  content_.push({url: jsonResponse.data.children[i].data.url});
                } 
                else {
                  content_.push({});
                }
                let epochTime = Math.floor(Date.now()/1000);
                let postTime = jsonResponse.data.children[i].data.created_utc;
                let difference = Math.floor(epochTime - postTime);
                let timeInX;
                let exactTimeInX;
                if(difference < 60){
                  timePosted_.push(`Posted by u/${author_[i]} ${difference} seconds ago`)
                } else if(difference < 3600){
                  timeInX = difference / 60;
                  exactTimeInX = Math.floor(timeInX);
                  timePosted_.push(`Posted by u/${author_[i]} ${exactTimeInX} minutes ago`)
                } else if(difference < 86400){
                  timeInX = difference / 3600;
                  exactTimeInX = Math.floor(timeInX);
                  timePosted_.push(`Posted by u/${author_[i]} ${exactTimeInX} hours ago`)
                } else if(difference < 604800){
                  timeInX = difference / 86400;
                  exactTimeInX = Math.floor(timeInX);
                  timePosted_.push(`Posted by u/${author_[i]} ${exactTimeInX} days ago`)
                } else if(difference > 604800){
                  timeInX = difference / 604800;
                  exactTimeInX = Math.floor(timeInX);
                  timePosted_.push(`Posted by u/${author_[i]} ${exactTimeInX} weeks ago`)
                }
                postPermaLink_.push(jsonResponse.data.children[i].data.permalink);
              }
              setSubreddit(sreddit);
              setNumberOfLikes(nOfLikes);
              setTitle(title_);
              setNumberOfComments(nOfComments);
              setContent(content_)
              setTimePosted(timePosted_);
              setPostPermaLink(postPermaLink_);
            }} catch(e) {
              console.log('')
            }
            }

            loadSubreddits();

        },[keySubreddit])

        useEffect(()=> {
          let [commentAuthor_, commentTime_, commentText_, commentUps_] = [[],[],[],[]];
          if(comments.permalink){
            const  loadComments = async () => {
              let url = 'https://www.reddit.com/'+ comments.permalink + '.json';
              const response = await fetch(url);
              const jsonResponse = await response.json();
              // console.log(jsonResponse);
              if(jsonResponse[1].data.children){
                for(let i = 0; jsonResponse[1].data.children.length > 20 ? i < 20 : 
                  i < jsonResponse[1].data.children.length - 1; i++){
                  commentAuthor_.push(jsonResponse[1].data.children[i].data.author);
                  let epochTime = Math.floor(Date.now()/1000);
                  let postTime = jsonResponse[1].data.children[i].data.created_utc;
                  let difference = Math.floor(epochTime - postTime);
                  let timeInX;
                  let exactTimeInX;
                  if(difference < 60){
                    commentTime_.push(`${difference} seconds ago`)
                  } else if(difference < 3600){
                    timeInX = difference / 60;
                    exactTimeInX = Math.floor(timeInX);
                    commentTime_.push(`${exactTimeInX} minutes ago`)
                  } else if(difference < 86400){
                    timeInX = difference / 3600;
                    exactTimeInX = Math.floor(timeInX);
                    commentTime_.push(`${exactTimeInX} hours ago`)
                  } else if(difference < 604800){
                    timeInX = difference / 86400;
                    exactTimeInX = Math.floor(timeInX);
                    commentTime_.push(`${exactTimeInX} days ago`)
                  } else if(difference > 604800){
                    timeInX = difference / 604800;
                    exactTimeInX = Math.floor(timeInX);
                    commentTime_.push(`${exactTimeInX} weeks ago`)
                  }
                  commentText_.push(jsonResponse[1].data.children[i].data.body.replace('&amp;', '&').replace('&gt;', ''));
                  let ups = jsonResponse[1].data.children[i].data.ups
                  let updatedUps = Math.floor(ups/100)/10;
                  let numToString = updatedUps.toString();
                  if(ups < 1000){
                    commentUps_.push(ups);
                  } else if(ups > 1000 && !numToString.includes('.')){
                    commentUps_.push(`${updatedUps}.0k`);
                  } else if(ups > 1000 && numToString.includes('.')){
                    commentUps_.push(`${updatedUps}k`);
                  }
                }
                setCommentAuthor(commentAuthor_);
                setCommentTime(commentTime_); 
                setCommentText(commentText_);
                setCommentUps(commentUps_);
                setDeletePriviousComment(false);
                setLoadingPhase(false);

              }
          }

            loadComments();


         }
        }, [comments.permalink])

        const changeKeySubreddit = (e)=> { 
          let targetElement = e.target.innerText.toLowerCase();
          let keyReddit = targetElement.length === 3 ? targetElement : e.target.getAttribute('data-subreddit');
          setKeySubreddit(keyReddit)
        };

        const changetoggleState = (e)=> { 
          // console.log(`deletePreviousComment: ${deletePreviousComment} comments.toggle: ${comments.toggle} loadingPhase: ${loadingPhase}`);
          let link = e.target.getAttribute('data-comment-data');
          let postNumber_ = parseInt(e.target.getAttribute('data-comment-number'));
          let toggleCondition;
          if(comments.selectedCommentId === postNumber_){
            setLoadingPhase(false);
            toggleCondition = comments.toggle ? false : true;
          } else {
            setLoadingPhase(loadingPhase ? false : true);
            toggleCondition = true;
          }
          setComments({permalink: link, selectedCommentId: postNumber_, 
                      toggle: toggleCondition});
        }

        const changeToHome = ()=> {
          setKeySubreddit('hot');
        };
        const changeMode = ()=> {         
            setDarkMode(darkMode ? false : true);
        }

        const changeSubreddit = (e)=>{
          setKeySubreddit('r/'+e.target.value)
        }

        const clearInput = ()=> {
          const input = document.querySelector('input');
          input.value = '';
          const input2 = document.getElementsByClassName('input2')[0];
          input2.value = '';
        }

                      
        return !timePosted ? 
             (        <div className="loading">
                        <img src={require('./images/0.png')} alt=""/>
                        <div className="loading-line"></div>
                      </div>) : 
             (
          <div className={darkMode ? 'App dark-App' : 'App'}>
            <nav className={darkMode ? 'dark-nav' : ''}>
              {darkMode ? <img src={require('./images/redditlogo darkmoder.png')} alt="redditlogo" className='redditlogo' onClick={changeToHome}/> : 
              <img src={require('./images/redditlogo.png')} alt="redditlogo" className='redditlogo' onClick={changeToHome}/>}              
              <div className='search'>
                { darkMode ? <img src={require('./images/search icon dark.png')} alt="searchicon" className='searchicon'/> : 
                  <img src={require('./images/search icon.png')} alt="searchicon" className='searchicon'/>}
                <input type="text" placeholder='Search Subreddit' className={darkMode ? 'dark-input' : ''} 
                onChange={changeSubreddit} />
                  { darkMode ? <img src={require('./images/close dark.png')} alt="searchicon" className='close-icon' onClick={clearInput}/> : 
                  <img src={require('./images/close.png')} alt="searchicon" className='close-icon' onClick={clearInput}/> }
              </div>
              <div className='nav-buttons'>
                {darkMode ? <img src={require('./images/moon darkmode.png')} alt="searchicon"/> :  
                 <img src={require('./images/moon.png')} alt="searchicon"/> } 
                <p>Dark Mode</p>
                <div className={darkMode ? 'slider-div dark-mode' : 'slider-div'} onClick={changeMode}>
                 <div className='mode-slider'></div>
                </div>
              </div>
            </nav>
            <div className='search-parttwo'>
                { darkMode ? <img src={require('./images/search icon dark.png')} alt="searchicon" className='search-icon'/> : 
                  <img src={require('./images/search icon.png')} alt="searchicon" className='search-icon'/>}
                <input type="text" placeholder='Search Subreddit' className={darkMode ? 'dark-input' : 'input2'} 
                onChange={changeSubreddit} />
                  { darkMode ? <img src={require('./images/close dark.png')} alt="searchicon" className='close-icon' onClick={clearInput}/> : 
                  <img src={require('./images/close.png')} alt="searchicon" className='close-icon' onClick={clearInput}/> }
              </div>
            <div  className='popular'><h5>{keySubreddit === 'hot' || keySubreddit === 'new' || keySubreddit === 'top' ? 'Popular Posts' : ''}</h5></div>
            <div className='all-content' >
                    <div className='main-content' >
                          {keySubreddit === 'hot' || keySubreddit === 'new' || keySubreddit === 'top' ? 
                          <div className={darkMode ? 'title-icons dark-title-icons' : 'title-icons'} >
                              <div className={darkMode ? 'icon-div dark-icon-div' : 'icon-div'} onClick={changeKeySubreddit} tabIndex='11'>
                                { darkMode ? <img className='icon'  src={require('./images/hot icon darkmode.png')} alt="fireicon"/> : 
                                <img className='icon'  src={require('./images/—Pngtree—fire vector icon in flat_5552262.png')} alt="fireicon"/>}
                              
                              <h6 className='link-text' onClick={changeKeySubreddit}>Hot</h6>
                              </div>
                              <div className={darkMode ? 'icon-div dark-icon-div' : 'icon-div'}onClick={changeKeySubreddit} tabIndex='12'>
                                { darkMode ?  <img className='icon' src={require('./images/toplogo darkmode.png')} alt="topicon"/>: 
                                <img className='icon' src={require('./images/toplogo.png')} alt="topicon"/>} 
                                <h6 className='link-text' >Top</h6>
                              </div> 
                              <div className={darkMode ? 'icon-div dark-icon-div' : 'icon-div'}onClick={changeKeySubreddit} tabIndex='13'>
                                { darkMode ?  <img className='icon' src={require('./images/newicon darkmode.png')} alt="newicon"  />: 
                                <img className='icon' src={require('./images/newicon.png')} alt="newicon"  />}   
                                <h6 className='link-text' >New</h6>
                              </div>                            
                          </div> : 
                          <div className={darkMode ? 'subreddit-header dark-subreddit-header' : 'subreddit-header'}>
                            <img className='header-icon' src={require('./images/3.png')} alt="icon"  />
                            <div className='header-text'>
                              <h2>{keySubreddit.replace('r/', '')}</h2>
                              <p>{keySubreddit}</p>
                            </div>
                          </div>
                           }
                          {dataList.map((data, index) => {
                                let element;
                                let randomNumber = Math.floor(Math.random()*9);
                                if(data[5].video){
                                  element = <div className='content'><video className='content-video'controls autoPlay mute="true" > 
                                  <source src={data[5].video}></source> </video></div> 
                                } else if(data[5].image){
                                  element = <div className='content'><img src={data[5].image} alt="redditImage" className='content-image'/></div>
                                }
                                else {
                                  element = <a href={data[5].url} target='_blank' rel="noreferrer" className='content-link'>{data[5].url}</a> 
                                }
                              return (
                                <div key={index} className={darkMode ? 'posts-content dark-posts-content': 'posts-content'} >
                                  <div className={darkMode ? 'votes dark-votes' : 'votes'}>
                                      {darkMode ? <img className='up-arrow' src={require('./images/toplogo darkmode.png')} alt="topicon"/> : 
                                      <img className='up-arrow' src={require('./images/toplogo.png')} alt="topicon"/>}
                                      <h6 key={(index*5)+5}>{data[1]}</h6>
                                      { darkMode ? <img className=' down-arrow' src={require('./images/toplogoinverted darkmode.png')} alt="topicon"/> :
                                      <img className=' down-arrow' src={require('./images/toplogoinverted.png')} alt="topicon"/>} 
                                  </div>
                                  <div className={darkMode ? 'author-content-comment dark-author-content-comment' : 'author-content-comment'}>
                                      <div className='icon-subreddit-author'>
                                        <img className='subreddit-icon-posts' src={redditLogos[randomNumber]} 
                                          alt="subreddit-icon"/>
                                        <h6 key={(index*5)+6} >{data[0]}</h6>
                                        <div className='dot'></div>
                                        <p key={(index*5)+7}>{data[3]}</p>
                                      </div>
                                      <h5 key={(index*5)+8}>{data[2]}</h5>
                                                  {element}  
                                      <div className='comments-and-icon' >
                                        <img className='icon comment-icon' src={require('./images/message.png')} alt="topicon"
                                        onClick={changetoggleState} data-comment-data={data[6]} data-comment-number= {index}/>
                                        <p key={(index*5)+9} onClick={changetoggleState} data-comment-data={data[6]} 
                                        data-comment-number= {index}> {data[4]} </p>
                                      </div>
                                      {loadingPhase && comments.selectedCommentId === index ? <div className='loading-commenticon-div' data-comment-number= {index}>
                                        { darkMode ? <img src={require('./images/loading dark.png')} alt="loadingIcon" className='loading-comment'/> : 
                                        <img src={require('./images/loading.png')} alt="loadingIcon" className='loading-comment'/>}  
                                      </div>  : ''}
                                      {comments.selectedCommentId === index && comments.toggle && !loadingPhase ? 
                                        commentData.map((comment, index)=> {
                                          let randomNumber_ = Math.floor(Math.random()*9);
                                          return (
                                            <div className='comments' key={index}>
                                              <div className='comment-title'>
                                                <img className='subreddit-icon-posts' src={redditLogos[randomNumber_]} 
                                                  alt="subreddit-icon"/>
                                                <h6> {comment[0]} </h6>
                                                <div className='dot'></div>
                                                <p className='comment-time-posted'>{comment[1]}</p>
                                              </div>
                                              <p className='comment-p'> {comment[2]} </p>
                                              <div className='comment-upvotes'>
                                                 {darkMode ? <img className='up-arrow' src={require('./images/toplogo darkmode.png')} alt="topicon"/> : 
                                                <img className='up-arrow' src={require('./images/toplogo.png')} alt="topicon"/>}
                                                <h6> {comment[3]} </h6>
                                                {darkMode ? <img className='down-arrow' src={require('./images/toplogoinverted darkmode.png')} alt="topicon"/> : 
                                                <img className='down-arrow' src={require('./images/toplogoinverted.png')} alt="topicon"/>}
                                              </div>
                                            </div>
                                          )
                                        }) 
                                      : ''}                                                                    
                                  </div>
                                </div>
                              )
                              }
                            )
                            }
                    </div>
                    <div className={darkMode ? 'side-content dark-side-content' : 'side-content'}>
                            <div className='background-icon'>
                              <h3 className={darkMode ? 'community-h3 dark-h3': 'community-h3'}>Top Subreddit Communities</h3>
                            </div>
                            {popularSubreddits.map((subreddit,index) => 
                                <div  className={darkMode ? "side-subreddit dark-side-subreddit" : "side-subreddit"} onClick={changeKeySubreddit} data-subreddit={subreddit} 
                                tabIndex={index+1} key={index}>
                                  <h6 data-subreddit={subreddit}>{index+1}</h6>
                                  <img className='greenticks-icon' src={require('./images/green ticks.png')} alt="green-ticks-icon" data-subreddit={subreddit}/>
                                  <img className='subreddit-icon icon' src={redditLogos[index]} alt="subreddit-icon" data-subreddit={subreddit}/> 
                                  <h6 key={index} className='side-content-title' data-subreddit={subreddit}>{subreddit}</h6>
                                </div>)
                            }
                    </div>
            </div>
         </div>
        )
      }

      export default App;