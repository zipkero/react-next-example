import React, { useState } from "react";
import Link from "next/link";

const App = ({ breeds }) => {
  const [cat, setCat] = useState("");
  const onChange = (e) => {
    setCat(e.target.value);
  };
  return (
    <div>
      <label>
        <select onChange={onChange}>
          <option>-----</option>
          {breeds.map((b) => (
            <option value={b.id} key={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
      <Link href={`/cat/${cat}`}>
        <button>Search</button>
      </Link>
    </div>
  );
};

/**
 * 빌드 시 API 호출을 통해 props 로 데이터를 전달하고 렌더링하여 응답
 */
export const getStaticProps = async () => {
  try {
    const res = await fetch("https://api.thecatapi.com/v1/breeds");
    if (res.status === 200) {
      const breeds = await res.json();
      return {
        props: {
          breeds,
        },
      };
    }
    return {
      props: {},
    };
  } catch (e) {
    console.log(e);
    return {
      props: {},
    };
  }
};

export default App;
