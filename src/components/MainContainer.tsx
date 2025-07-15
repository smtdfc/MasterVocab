import {ReactNode} from 'react';
import "@/styles/container.css";

export default function MainContainer(
  {children}:{
    children:ReactNode
  }
){
  return (
    <div className="container">
      {children}
    </div>
  );
}