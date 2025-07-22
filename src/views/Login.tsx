/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState } from 'react'

import type { FormEvent } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import {
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Checkbox,
  Button,
  FormControlLabel,
  Divider
} from '@mui/material'

import type { Mode } from '@core/types'

import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'
import { useImageVariant } from '@core/hooks/useImageVariant'

declare global {
  interface Window {
    FB: any
  }
}

const RememberMe = React.memo(() => {
  return <FormControlLabel control={<Checkbox />} label='Remember me' />
})

const MemoizedLogo = React.memo(() => (
  <Link href='/' className='flex justify-center items-center mbe-6'>
    <Logo />
  </Link>
))

const darkImg = '/images/pages/auth-v1-mask-dark.png'
const lightImg = '/images/pages/auth-v1-mask-light.png'

const Login = ({ mode }: { mode: Mode }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  const socialLogins = [
    {
      platform: 'Facebook',
      iconClass: 'ri-facebook-fill',
      onClick: () => {},
      colorClass: 'text-facebook'
    },
    {
      platform: 'Twitter',
      iconClass: 'ri-twitter-fill',
      onClick: () => {},
      colorClass: 'text-twitter'
    },
    {
      platform: 'GitHub',
      iconClass: 'ri-github-fill',
      onClick: () => {},
      colorClass: 'text-github'
    },
    {
      platform: 'Google',
      iconClass: 'ri-google-fill',
      onClick: () => {},
      colorClass: 'text-googlePlus'
    }
  ]

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <MemoizedLogo />
          <div className='flex flex-col gap-5'>
            <Typography variant='h4'>Welcome 👋🏻</Typography>
            <form noValidate autoComplete='off' onSubmit={e => handleSubmit(e)} className='flex flex-col gap-5'>
              <TextField autoFocus fullWidth label='Email' value={email} onChange={e => setEmail(e.target.value)} />
              <TextField
                fullWidth
                value={password}
                onChange={e => setPassword(e.target.value)}
                label='Password'
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={() => handleClickShowPassword()}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                <RememberMe />
                <Typography className='text-end' color='primary' component={Link} href='/forgot-password'>
                  Forgot password?
                </Typography>
              </div>
              <Button fullWidth variant='contained' type='submit'>
                Log In
              </Button>
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>New on our platform?</Typography>
                <Typography component={Link} href='/register' color='primary' onClick={() => {}}>
                  Create an account
                </Typography>
              </div>
              <Divider className='gap-3'>or</Divider>
              <div className='flex justify-center items-center gap-2'>
                {socialLogins.map(({ platform, iconClass, onClick, colorClass }) => (
                  <IconButton key={platform} size='small' className={colorClass} onClick={onClick}>
                    <i className={iconClass} />
                  </IconButton>
                ))}
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default Login
