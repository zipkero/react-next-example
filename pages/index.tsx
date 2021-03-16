import React, { useState } from "react";
import styled from "styled-components";
import { NextPage } from "next";
import { useRouter } from "next/router";

type Breed = {
  id: string;
  name: string;
};

interface IProps {
  breeds: Breed[];
}

const Container = styled.div`
  padding: 10px;
  width: 100%;
  display: flex;
  justify-content: center;

  select {
    width: 150px;
    height: 25px;
    outline: none;
    border: 1px solid gray;
    border-radius: 5px;
  }

  button {
    margin-left: 15px;
    width: 100px;
    height: 25px;
    background-color: white;
    border: 1px solid gray;
    border-radius: 5px;
  }
`;

const ModalLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .model-wrapper {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: gray;
    opacity: 0.5;
  }

  .modal-content {
    padding: 5px;
    z-index: 101;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 150px;

    border: 1px solid gray;
    border-radius: 5px;
  }
`;

const Index: NextPage<IProps> = ({ breeds }) => {
  const router = useRouter();
  const [cat, setCat] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCat(e.target.value);
  };

  const onSearch = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cat) {
      setError("품종을 선택하세요.");
      return;
    }
    await router.push(`/cat/${cat}`);
  };

  const onClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    setError("");
  };
  return (
    <>
      <Container>
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

        <button onClick={onSearch}>검색</button>
      </Container>
      {error && (
        <ModalLayer>
          <div className="model-wrapper" />
          <div className="modal-content">
            <p>{error}</p>
            <button onClick={onClose}>닫기</button>
          </div>
        </ModalLayer>
      )}
    </>
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

export default Index;
