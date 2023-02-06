import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
/* 사용자 정의 태그 (무조건 대문자로 시작) 
  사용자 정의 태그=컴포넌트 
*/
//16분 21초
function Header(props) {
  console.log("props", props, props.title);
  return (
    <header>
      <h1>
        <a
          href="/"
          onClick={(event) => {
            event.preventDefault(); //기본동작 방지..클릭해도 리로드x
            props.onChangeMode();
          }}
        >
          {props.title}
        </a>
      </h1>
    </header>
  );
}
function Nav(props) {
  const lis = []; //lis라는 배열선언
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(
      <li key={t.id}>
        <a
          id={t.id} //태그의 속성으로 넘길시 문자로 변경
          href={"/read/" + t.id}
          onClick={(event) => {
            event.preventDefault();
            props.onChangeMode(Number(event.target.id)); //문자-숫자로 컨버팅
          }}
          /* onClick={(event)=>{
      event.preventDefault();     
      props.onChangeMode(event.target.id); //target은 이벤트를 유발시킨 태그를 가리킴
    }} */
        >
          {t.title}
        </a>
      </li>
    );
  } //for end
  return (
    <nav>
      <ol>{lis}</ol>
    </nav>
  );
} //nav

function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  );
} //article end

function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const title = event.target.title.value;
          const body = event.target.body.value;
          props.onCreate(title, body);
        }}
      >
        <p>
          {" "}
          <input type="text" name="title" placeholder="title" />
        </p>
        <p>
          <textarea name="body" placeholder="body" />
        </p>
        <p>
          {" "}
          <input type="submit" value="Create" />
        </p>
      </form>
    </article>
  );
}
function Update(props) {
  const [title, setTitle] = useState(props.title); //타이틀수정
  const [body, setBody] = useState(props.body);
  return (
    <article>
      <h2>Update</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const title = event.target.title.value;
          const body = event.target.body.value;
          props.onUpdate(title, body);
        }}
      >
        <p>
          {" "}
          <input
            type="text"
            name="title"
            placeholder="title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value); //새로운 타이값으로 바꾸기
            }}
          />
        </p>
        <p>
          <textarea
            name="body"
            placeholder="body"
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
            }}
          />
        </p>
        <p>
          {" "}
          <input type="submit" value="Update" />
        </p>
      </form>
    </article>
  );
}
function App() {
  /* const _mode = useState("WELCOME"); //usestate는 배열 return /배열의0번째 요소는
  //상태의 값을 읽을때 쓰는 데이터 /1번째 데이터는 상태의 값을 변경할때 사용
  const mode = _mode[0]; //읽어오기
  const setMode=_mode[1]; //값변경 */

  const [mode, setMode] = useState("WELCOME");
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4); //초기값은 4로 지정
  const [topics, settopics] = useState([
    { id: 1, title: "html", body: "html is..." },
    { id: 2, title: "css", body: "css is..." },
    { id: 3, title: "js", body: "js is..." },
  ]);
  let content = null;
  let contextControl = null;
  if (mode === "WELCOME") {
    //초기
    content = <Article title="Welcome" body="Hello,WEB"></Article>;
  } else if (mode === "READ") {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>;
    contextControl = (
      <>
        <li>
          <a
            href={"/update/" + id}
            onClick={(event) => {
              event.preventDefault();
              setMode("UPDATE");
            }}
          >
            Update
          </a>
        </li>

        <li>
          <input
            type="button"
            value="Delete"
            onClick={() => {
              const newTopics = [];
              for (let i = 0; i < topics.length; i++) {
                if (topics[i].id !== id) {
                  newTopics.push(topics[i]);
                }
              }
              settopics(newTopics);
            }}
          />
        </li>
      </>
    );
    //빈태그
  } else if (mode === "CREATE") {
    content = (
      <Create
        onCreate={(_title, _body) => {
          const newTopic = { id: nextId, title: _title, body: _body };
          const newTopics = [...topics];
          newTopics.push(newTopic);
          settopics(newTopics);
          setMode("READ");
          setId(nextId);
          setNextId(nextId + 1);
        }}
      ></Create>
    );
  } else if (mode === "UPDATE") {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = (
      <Update
        title={title}
        body={body}
        onUpdate={(title, body) => {
          //console.log(title, body);
          const newTopics = [...topics]; //복제
          const updateTopic = { id: id, title: title, body: body }; //수정된 topic
          for (let i = 0; i < newTopics.length; i++) {
            if (newTopics[i].id == id) {
              newTopics[i] = updateTopic;
              break;
            }
          }
          settopics(newTopics);
        }}
      ></Update>
    );
  } //update

  return (
    <div className="App">
      <Header
        title="WEB"
        onChangeMode={() => {
          setMode("WELCOME");
        }}
      ></Header>

      <Nav
        topics={topics}
        onChangeMode={(_id) => {
          setMode("READ"); //값을 바꿀때
          setId(_id);
        }}
      ></Nav>
      {content}
      <ul>
        <li>
          <a
            href="/create"
            onClick={(event) => {
              event.preventDefault();
              setMode("CREATE");
            }}
          >
            Create
          </a>
        </li>
        {contextControl}
      </ul>
    </div>
  );
}
export default App;
