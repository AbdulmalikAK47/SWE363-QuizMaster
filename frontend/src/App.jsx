import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Quizzes from "./pages/Quizzes";
import Questions from "./pages/Questions";
import Welcome from "./pages/Welcome";
import History from "./pages/History";
import Learn from "./pages/Learn";
import SignUpModalAdmin from "./pages/SignUpModalAdmin";
import WelcomeAdmin from "./pages/WelcomeAdmin";
import CreateQuiz from "./pages/CreateQuiz";
import ModifyQuiz from "./pages/ModifyQuiz";
import DeleteQuiz from "./pages/DeleteQuiz";
import QuizStatus from "./pages/QuizStatus";
import "./styles/Transitions.css";

const App = () => {
    const location = useLocation();

    return (
        <TransitionGroup component={null}>
            <CSSTransition
                key={location.key}
                timeout={300}
                classNames="fade"
                nodeRef={React.createRef()}
            >
                <div>
                    <Routes location={location}>
                        <Route path="/" element={<Home />} />
                        <Route path="/aboutus" element={<AboutUs />} />
                        <Route path="/quizzes" element={<Quizzes />} />
                        <Route path="/quiz/:quizId" element={<Questions />} />
                        <Route path="/welcome" element={<Welcome />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/create-quiz" element={<CreateQuiz />} />
                        <Route path="/modify-quiz" element={<ModifyQuiz />} />
                        <Route path="/delete-quiz" element={<DeleteQuiz />} />
                        <Route path="/quiz-status" element={<QuizStatus />} />
                        <Route
                            path="/welcome-admin"
                            element={<WelcomeAdmin />}
                        />
                        <Route
                            path="/signup-admin"
                            element={<SignUpModalAdmin />}
                        />
                    </Routes>
                </div>
            </CSSTransition>
        </TransitionGroup>
    );
};

export default App;
