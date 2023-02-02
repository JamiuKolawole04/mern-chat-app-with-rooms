import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

/* React-specific entry point that automatically generates
   hooks corresponding to the defined endpoints */
import { createApi } from "@reduxjs/toolkit/query/react";

const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8084/api/v1",
  }),
  endpoints: (builder) => ({
    // registering or creating users
    signUpUser: builder.mutation({
      query: (user) => ({
        url: "/auth/login",
        method: "POST",
        body: user,
      }),
    }),
  }),
});
