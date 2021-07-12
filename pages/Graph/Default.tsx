import React from 'react'
import dynamic from "next/dynamic";

const GraphComponent = dynamic(
  () => {
    return import("../../components/Graph/Default");
  },
  { ssr: false }
);

export default function DefaultElement() {
  return (
    <GraphComponent />
  )
}