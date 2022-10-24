import React, {
  memo,
  useCallback,
  useState,
} from 'react';

function SignUp(): React.ReactElement {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [recoveryAnswer, setRecoveryAnswer] = useState<string>('');
  const [recoveryQuestion, setRecoveryQuestion] = useState<string>('');

  const handleInput = (event: React.FormEvent<HTMLInputElement>): void => {
    const { currentTarget: { name = '', value = '' } = {} } = event;
    if (name === 'login') {
      return setLogin(value);
    }
    if (name === 'password') {
      return setPassword(value);
    }
    if (name === 'recoveryAnswer') {
      return setRecoveryAnswer(value);
    }
    return setRecoveryQuestion(value);
  };

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      console.log('submit', login, password);
    },
    [
      login,
      password,
    ],
  );

  return (
    <div>
      <form
        onSubmit={handleSubmit}
      >
        <input
          name="login"
          onChange={handleInput}
          placeholder="Login"
          type="text"
          value={login}
        />
        <input
          name="password"
          onChange={handleInput}
          placeholder="Password"
          type="password"
          value={password}
        />
        <input
          name="recoveryQuestion"
          onChange={handleInput}
          placeholder="Account recovery question"
          type="text"
          value={recoveryQuestion}
        />
        <input
          name="recoveryAnswer"
          onChange={handleInput}
          placeholder="Account recovery answer"
          type="text"
          value={recoveryAnswer}
        />
        <button
          type="submit"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}

export default memo(SignUp);
