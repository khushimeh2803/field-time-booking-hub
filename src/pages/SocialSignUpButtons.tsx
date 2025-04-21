
const SocialSignUpButtons = () => (
  <div className="mt-6">
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-muted"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white text-muted-foreground">Or continue with</span>
      </div>
    </div>
    <div className="mt-6 grid grid-cols-2 gap-3">
      <button
        type="button"
        className="w-full inline-flex justify-center py-2 px-4 border border-muted rounded-md shadow-sm bg-white text-sm font-medium text-muted-foreground hover:bg-muted/10"
        disabled
      >
        {/* Fake GitHub */}
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.48 0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.338-3.369-1.338-.454-1.152-1.11-1.459-1.11-1.459-.908-.619.069-.606.069-.606 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.645 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.547 1.375.202 2.393.1 2.645.64.699 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.92.678 1.854 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.48A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        type="button"
        className="w-full inline-flex justify-center py-2 px-4 border border-muted rounded-md shadow-sm bg-white text-sm font-medium text-muted-foreground hover:bg-muted/10"
        disabled
      >
        {/* Fake Google */}
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.36 14.83c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
);

export default SocialSignUpButtons;
