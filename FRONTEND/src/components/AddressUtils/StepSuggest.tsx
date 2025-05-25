import {useState} from 'react';
import Autosuggest from 'react-autosuggest';
import {IResponseItem} from './../../interfaces';
import {runSuggest} from './../../util';
import {Container, Button, Form} from 'react-bootstrap';

function renderSuggestion(suggestion: IResponseItem) {
    return (
        <div>
            <strong>{suggestion.name}</strong>
            <br/>
            <span className="text-muted">{suggestion.location}</span>
        </div>
    );
}

function getSuggestionValue(suggestion: IResponseItem) {
    return suggestion.name;
}

function renderSuggestionsContainer({containerProps, children}: { containerProps: any, children: any }) {
    const {key, ...rest} = containerProps;
    return <div key={key} {...rest}>{children}</div>;
}

interface IStepSuggestProps {
    onSelected: any;
}

export default function StepSuggest({onSelected}: IStepSuggestProps) {
    const [suggestions, setSuggestions] = useState<Array<IResponseItem>>([]);
    const [value, setValue] = useState('');

    const handleInputChange = function (
        _event: React.FormEvent<HTMLElement>,
        {newValue}: { newValue: string }
    ) {


        setValue(newValue);
    };

    const onSuggestionsFetchRequested = ({value: query}: { value: string }) => {
        runSuggest('cs', query, setSuggestions);
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onSuggestionSelected = (
        _event: any,
        {suggestion}: { suggestion: IResponseItem }
    ) => {
        setValue(getSuggestionValue(suggestion));
        onSelected(suggestion);
    };

    return (
        <Container className="px-0">
            <Form.Group controlId="suggestInput" className="mb-3">
                <Form.Label
                    className="mb-2"
                    style={{fontWeight: 600, fontSize: '1.15rem', textAlign: 'left', display: 'block'}}
                >
                    Zadejte adresu
                </Form.Label>
                <div className="pt-1">
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        onSuggestionSelected={onSuggestionSelected}
                        inputProps={{
                            value,
                            onChange: handleInputChange,
                            type: 'text',
                            className: 'form-control w-100',
                            placeholder: 'Např. Dlouhá 123, Praha',
                        }}
                        renderSuggestionsContainer={renderSuggestionsContainer}
                    />
                </div>
            </Form.Group>

            <div className="d-flex justify-content-start mt-3">
                <Button variant="secondary" onClick={() => onSelected(null)}>
                    Zadat adresu ručně
                </Button>
            </div>
        </Container>
    );
}
