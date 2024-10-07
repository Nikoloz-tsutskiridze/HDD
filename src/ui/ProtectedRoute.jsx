import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  display: flex;
  background-color: var(--color-grey-50);
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  //1. Load authenticated user
  const { isAuthenticated, isLoading } = useUser();

  //2. if there is no authenticated user,reditect to the /login
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate("/Login");
    },
    [isLoading, isAuthenticated, navigate]
  );

  //3. While loading show spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />;
      </FullPage>
    );

  //4. if ther is a user render app

  if (isAuthenticated) return children;
}
export default ProtectedRoute;
