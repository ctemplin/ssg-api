import '@testing-library/jest-dom';
import { render, fireEvent, waitFor, screen, queries } from '@testing-library/react'
import React from 'react'
import Index from './index'

test('renders in and checks search box visibility', async () => {
    render(<Index />)

    var searchBox
    await waitFor(_=> searchBox = screen.getByPlaceholderText("Artist search..."))
    expect(searchBox).toBeVisible()
  })