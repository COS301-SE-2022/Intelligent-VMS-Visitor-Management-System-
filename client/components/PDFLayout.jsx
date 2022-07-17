const PDFLayout = ({ children }) => {
    return (
        <html>
            <head>
                <meta charSet="utf8" />
            </head>
            <body>{children}</body>
        </html>
    );
};

export default PDFLayout;
