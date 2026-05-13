import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button } from '../../../shared/components/ui';

import {
  setUserType,
  initialState as signupInitialState,
} from '../slices/signup-slice';
import type { RootState } from '../../../app/store';
import { USER_TYPES } from '../constants/signup-constants';

import { SignupCustomer } from './signup-customer';
import { SignupPartner } from './signup-partner';

export const Signup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { userType } = useAppSelector(
    (state: RootState) => state.signup ?? signupInitialState
  );

  const signupRequired = useAppSelector(
    (state: RootState) => state.auth.signupRequired
  );

  useEffect(() => {
    if (!signupRequired) {
      navigate('/');
    }
  }, [signupRequired, navigate]);

  const isBusinessUser = userType !== '일반회원';

  return (
    <div className="flex w-[calc(100%+20px)] flex-col gap-4 p-4 md:-mx-10 md:w-[calc(100%+80px)] xl:-mx-[19.469rem] xl:w-[calc(100%+(19.469rem*2))]">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4">
        <div className="flex w-full gap-2">
          {USER_TYPES.map((type) => (
            <Button
              key={type.value}
              label={type.label}
              variant={
                userType === type.value ? 'secondaryDark' : 'secondaryLight'
              }
              onClick={() => dispatch(setUserType(type.value))}
              className="flex-1"
              type="button"
            />
          ))}
        </div>
        {isBusinessUser ? <SignupPartner /> : <SignupCustomer />}
      </div>
    </div>
  );
};
