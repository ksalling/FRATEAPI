import { Heading, TextContainer } from '@shopify/polaris';

function GreenDot(carrier) {
    
    return(
        <Heading>
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-check-circle-fill" fill="green" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign: "middle", marginRight: "3px"}}>
                <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg><span style={{verticalAlign: "middle"}}>{carrier.carrier.name}</span>
        </Heading>
    )
}

export default GreenDot;

function RedDot(carrier) {
    
    return(
        <Heading>
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle-fill" fill="red" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign: "middle", marginRight: "3px"}}>
                <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.146-3.146a.5.5 0 0 0-.708-.708L8 7.293 4.854 4.146a.5.5 0 1 0-.708.708L7.293 8l-3.147 3.146a.5.5 0 0 0 .708.708L8 8.707l3.146 3.147a.5.5 0 0 0 .708-.708L8.707 8l3.147-3.146z"/>
            </svg><span style={{verticalAlign: "middle"}}>{carrier.carrier.name}</span>
        </Heading>
    )
}

export { RedDot };

function LocationTitle(location) {    
    return(
            <TextContainer>
                <Heading element="h2">
                    <span style={{verticalAlign: "middle"}}>{location.name.name}</span>
                </Heading>
            </TextContainer>
    )
}

export { LocationTitle };

