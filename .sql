Sub 'LoadComboCodigoCadastro'

    Combo_CodigoCadastro.HTMLTemplate = WWP_GetStyledDVCombo(!"HTML")

    &DmIntegracaoTipoVinculo = DmIntegracaoTipoVinculo.Convert(&TipoVinculoCodigo)

    Do case
        case &DmIntegracaoTipoVinculo = DmIntegracaoTipoVinculo.RH
            TextBlockCombo_CodigoCadastro.Caption = !"Matrícula"

        case &DmIntegracaoTipoVinculo = DmIntegracaoTipoVinculo.IMOBILIARIO
            TextBlockCombo_CodigoCadastro.Caption = !"Código do imóvel"

        case &DmIntegracaoTipoVinculo = DmIntegracaoTipoVinculo.MOBILIARIO
            TextBlockCombo_CodigoCadastro.Caption = !"Código do cadastro"
    Endcase

    wcAlteraCadastroProtocoloLoadDVCombo(
        !"CodigoCadastro",
        &TipoVinculoCodigo,
        "",
        &ComboDataLongVarchar
    )

    &CodigoCadastro_Data.FromJson(&ComboDataLongVarchar)

    // Importante para o DVCombo buscar novamente via client
    Combo_CodigoCadastro.DataListProcParametersPrefix = format(
        !' "ComboName": "CodigoCadastro", "TipoVinculoCodigo": "#%1#"',
        &TipoVinculoCodigo.InternalName
    )

    If &CodigoCadastro.IsEmpty()

        If &CodigoCadastro_Data.Count = 1

            &AuxCodigoCadastro = &CodigoCadastro_Data.Item(1).ID
            &CodigoCadastro.FromString(&AuxCodigoCadastro)

            prRecuperaDescricaoCadastro(
                &TipoVinculoCodigo,
                &CodigoCadastro,
                &CodigoCadastroDescription
            )

            Combo_CodigoCadastro.Enabled = false

        Else

            &CodigoCadastro.SetEmpty()
            &CodigoCadastroDescription = !""
            Combo_CodigoCadastro.Enabled = true

        Endif

    Else

        prRecuperaDescricaoCadastroDyn(
            &TipoVinculoCodigo,
            &CodigoCadastro,
            &CodigoCadastroDescription
        )

    Endif

    Combo_CodigoCadastro.SelectedText_set  = iif(&CodigoCadastroDescription.IsEmpty(), !"Selecione...", &CodigoCadastroDescription)
    Combo_CodigoCadastro.SelectedValue_set = iif(&CodigoCadastro.IsEmpty(), !"", &CodigoCadastro.ToString().Trim())

EndSub