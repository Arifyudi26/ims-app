'use client'
import React, { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Checkbox,
  Button,
  FormControlLabel,
  Divider
} from '@mui/material'

import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'
import { useImageVariant } from '@core/hooks/useImageVariant'
import type { Mode } from '@core/types'

const darkImg = '/images/pages/auth-v1-mask-dark.png'
const lightImg = '/images/pages/auth-v1-mask-light.png'

const MemoizedLogo = React.memo(() => (
  <Link href='/' className='flex justify-center items-center mbe-6'>
    <Logo />
  </Link>
))

const PrivacyPolicyLabel = React.memo(() => (
  <FormControlLabel
    control={<Checkbox />}
    label={
      <>
        <span>I agree to </span>
        <Link className='text-primary' href='/' onClick={e => e.preventDefault()}>
          privacy policy & terms
        </Link>
      </>
    }
  />
))

const Register = ({ mode }: { mode: Mode }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfPasswordShown, setIsConfPasswordShown] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confPassword, setConfPassword] = useState('')
  const [name, setName] = useState('')

  const router = useRouter()

  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfPassword = () => setIsConfPasswordShown(show => !show)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      router.push('/login')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  const socialRegister = [
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
          <Typography variant='h4'>Adventure starts here 🚀</Typography>
          <div className='flex flex-col gap-5'>
            <Typography className='mbs-1'></Typography>
            <form noValidate autoComplete='off' onSubmit={e => handleSubmit(e)} className='flex flex-col gap-5'>
              <TextField autoFocus fullWidth label='Username' value={name} onChange={e => setName(e.target.value)} />
              <TextField fullWidth label='Email' value={email} onChange={e => setEmail(e.target.value)} />
              <TextField
                fullWidth
                value={password}
                onChange={e => setPassword(e.target.value)}
                label='Password'
                type={isPasswordShown ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                fullWidth
                value={confPassword}
                onChange={e => setConfPassword(e.target.value)}
                label='Confirm Password'
                type={isConfPasswordShown ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClickShowConfPassword}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isConfPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <PrivacyPolicyLabel />
              <Button fullWidth variant='contained' type='submit'>
                Sign Up
              </Button>
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>Already have an account?</Typography>
                <Typography component={Link} href='/login' color='primary' onClick={() => {}}>
                  Sign in instead
                </Typography>
              </div>
              <Divider className='gap-3'>Or</Divider>
              <div className='flex justify-center items-center gap-2'>
                {socialRegister.map(({ platform, iconClass, onClick, colorClass }) => (
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

export default Register
