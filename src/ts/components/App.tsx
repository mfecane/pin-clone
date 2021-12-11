import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { ImageContext } from 'ts/conext/images-context'

import CollectionsList from 'ts/components/collections-list'
import Collection from 'ts/components/collection'
import Layout from 'ts/components/layout'
import Imageslist from 'ts/model/components/images-list'

const App = () => {
  const [context, setContext] = useState(null)

  useEffect(() => {
    // wanted to put iife here but those lazy motherfuckers
    // won't fix prettier
    var fn = async () => {
      let imagesList = new Imageslist()
      await imagesList.createItems().then()
      setContext(imagesList)
    }
    fn()
  }, [])

  return (
    <ImageContext.Provider value={[context, setContext]}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <CollectionsList />
              </Layout>
            }
          />
          <Route
            path="/collections/:id"
            element={
              <Layout>
                <Collection />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ImageContext.Provider>
  )
}

export default App
