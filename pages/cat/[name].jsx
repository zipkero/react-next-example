import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { useState } from "react";
import styled from "styled-components";

const ImgWrapper = styled.div`
  width: 900px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const getCats = async ({ catId, pageIndex }) => {
  try {
    const apiUrl = `https://api.thecatapi.com/v1/images/search?size=small&breed_id=${catId}&limit=1&page=${pageIndex}`;
    const result = await fetch(apiUrl);
    const data = await result.json();

    if (result.status === 200) {
      return data;
    }
    return [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

const name = ({ catId, catsInfo }) => {
  const [cats, setCats] = useState(catsInfo);
  const [pageIndex, setPageIndex] = useState(1);

  const onMore = async () => {
    setPageIndex((prev) => prev + 1);
    const cats = await getCats({ catId, pageIndex });
    setCats((prev) => [...prev, ...cats]);
  };

  return (
    <div>
      <div>
        <button type="button" onClick={onMore}>
          More...
        </button>
        <Link href="/">Move To '/'</Link>
      </div>
      <ImgWrapper>
        {cats.map((c) => (
          <div key={c.id}>
            <img src={c.url} width="300" />
          </div>
        ))}
      </ImgWrapper>
    </div>
  );
};

/**
 * 매 요청시마다 API 호출을 통해 props 로 데이터를 전달하고 렌더링하여 응답
 * @param {*} param0
 */
export const getServerSideProps = async ({ query }) => {
  const catId = query.name;
  const cats = await getCats({ catId, pageIndex: 1 });
  return {
    props: { catId: catId, catsInfo: cats },
  };
};

export default name;
